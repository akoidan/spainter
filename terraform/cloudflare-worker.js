function makeid(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(
        {length},
        () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('')
}


async function uploadFileAndGetResponse(request, env) {
    // https://github.com/TomasHubelbauer/mime-multipart/issues/1
    let body = await request.formData();
    let file = await body.get('file');
    const blob = await file.arrayBuffer();
    const id = makeid() + ".png";
    await env.spainter.put(id, blob, {
        httpMetadata: {
            "contentType": file.type,
            "contentDisposition": 'inline; filename="' + file.name + '"',
        },
    })
    let uploadedUrl = env.imgUrl + id
    return new Response(uploadedUrl, {
        headers: {
            "content-type": "text/plain",
        },
    });
}

export default {
    async fetch(request, env) {
        if (request.method === 'POST') {
            return await uploadFileAndGetResponse(request, env);
        } else {
            return new Response(env.html, {
                headers: {
                    "content-type": "text/html;charset=UTF-8",
                },
            });
        }
    },
};
