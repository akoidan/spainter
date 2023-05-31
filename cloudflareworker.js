const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta http-equiv="cache-control" content="no-cache" />
    <style>
        .pad1 {
            padding: 10px;
            box-sizing: border-box;
        }
        html, body, .pad1 {
            width: 100%;
            margin: 0;
            height:100%;
        }
        #saveBlobExampleHolder {
            position: absolute;
            z-index: 1;
            display: block;
            background: white;
            padding: 10px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 1px dashed red;
        }
        #textValue {
          display: block;
        }
        #saveBlobExampleHolder img {
            max-width: calc(100vw - 200px);
            max-height: calc(100vh - 200px);
        }
    </style>
<script src="https://cdn.jsdelivr.net/npm/spainter/index.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/spainter/index.css"/>
</head>
<body>

<div class="pad1">
    <div id="containerPainer"></div>
    <div id="saveBlobExampleHolder" style="display: none">
        <img id="saveBlobExample"/>
        <a id="textValue"></a>
        <input type="button" value="close" id="closebtn"/>
    </div>
</div>

<script>
  const host =  location.origin;
  var p = new Painter(containerPainer, {
    logger: {
      debug: function log() {
        var args = Array.prototype.slice.call(arguments);
        var parts = args.shift().split('{}');
        var params = [window.console, '%c' + 'painter', 'red'];
        for (var i = 0; i < parts.length; i++) {
          params.push(parts[i]);
          if (typeof args[i] !== 'undefined') { // args can be '0'
            params.push(args[i])
          }
        }
        return Function.prototype.bind.apply(console.log, params);
      }
    },
    onBlobPaste: function(blob) {
      let link;
      saveBlobExample.src = URL.createObjectURL(blob);
      saveBlobExampleHolder.style.display = 'block';
      textValue.textContent = 'Uploading image...'
      var formData = new FormData();
      formData.append('file', blob, new Date().toDateString() + '.png');
      fetch(host + '/upload_file', {
        method: "POST",
        body: formData,
      }).then(e => {
        return e.text();
      }).then(e => {
        let href = host+ e;
        textValue.href = href;
        textValue.textContent = href;
        link = href;
      }).then(
        () => navigator.permissions.query({name: "clipboard-write"})
      ).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          return navigator.clipboard.writeText(link).then(() => {
              console.log("Clipboard is modified with link");
          });
        }
      })
    }
  })
  window.painter = p;
  closebtn.onclick = function() {
    saveBlobExampleHolder.style.display = 'none';
  }

</script>
</body>
</html>
`;

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
  async fetch(request) {
    console.log(request.url);
    const searchString = '/upload_file';
    if (request.url.endsWith(".png")) {
      let cache = caches.default;
      return cache.match(request);
    } else if (request.url.endsWith(searchString)) {
      return await ulpoadUrlAndReturnResponse(request, searchString);
    } else {
      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
  },
};
