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


async function ulpoadUrlAndReturnResponse(request, searchString) {
  let uploadToUrl = request.url.substring(0, request.url.length - searchString.length);
  let cache = caches.default;
  let body = await request.formData();
  let file = await body.get('file');
  let fileData = await file.arrayBuffer();
  let imageUrl = "/" + makeid(10) + ".png";
  let uploadedUrl = uploadToUrl + imageUrl
  await cache.put(new Request(uploadedUrl), new Response(fileData, {
    headers: {
      "content-type": file.type,
      "Content-Disposition": 'inline; filename="' + file.name + '"',
    },
  }));
  return new Response(imageUrl, {
    headers: {
      "content-type": "text/plain",
    },
  });
}

export default {
  async fetch(request, env) {
    console.log(request.url);
    const searchString = '/upload_file';
    if (request.url.endsWith(".png")) {
      let cache = caches.default;
      return cache.match(request);
    } else if (request.url.endsWith(searchString)) {
      return await ulpoadUrlAndReturnResponse(request, searchString);
    } else {
      return new Response(env.html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
  },
};
