function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


async function ulpoadUrlAndReturnResponse(request, env) {
    // https://github.com/TomasHubelbauer/mime-multipart/issues/1
    let body = await request.formData();
    let file = await body.get('file');
    const blob = file.arrayBuffer();
    const id = makeid(10) + ".png";
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
            return await ulpoadUrlAndReturnResponse(request, env);
        } else {
            return new Response(env.html, {
                headers: {
                    "content-type": "text/html;charset=UTF-8",
                },
            });
        }
    },
};
