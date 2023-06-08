// https://github.com/TomasHubelbauer/mime-multipart
function* parseMimeMultipart(/** @type {Uint8Array} */ uint8Array) {
    const textDecoder = new TextDecoder();
    /** @typedef {{ name: string; values: string[]; }} Header */
    /** @typedef {{ type: 'boundary'; boundary: string; }} Boundary */
    /** @typedef {{ type: 'header-name'; boundary: string; name: string; headers: Header[]; }} HeaderName */
    /** @typedef {{ type: 'header-value'; boundary: string; name: string; value: string; values: string[]; headers: Header[]; }} HeaderValue */
    /** @typedef {{ type: 'content'; boundary: string; headers: Headers[]; index: number; length: number; }} Content */
    /** @type {Boundary | HeaderName | HeaderValue | Content} */
    let state = {type: 'boundary', boundary: ''};
    let index = 0;
    let line = 0;
    let column = 0;
    for (; index < uint8Array.byteLength; index++) {
        const character = textDecoder.decode(uint8Array.slice(index, index + 1));
        if (character === '\n') {
            line++;
            column = 0;
        }

        column++;

        switch (state.type) {
            case 'boundary': {
                // Check Windows newlines
                if (character === '\r') {
                    if (textDecoder.decode(uint8Array.slice(index + 1, index + 2)) !== '\n') {
                        throw new Error(`At ${index} (${line}:${column}): found an incomplete Windows newline.`);
                    }

                    break;
                }

                if (character === '\n') {
                    state = {type: 'header-name', boundary: state.boundary, name: '', value: '', headers: []};
                    break;
                }

                state.boundary += character;
                break;
            }
            case 'header-name': {
                // Check Windows newlines
                if (character === '\r') {
                    if (textDecoder.decode(uint8Array.slice(index + 1, index + 2)) !== '\n') {
                        throw new Error(`At ${index} (${line}:${column}): found an incomplete Windows newline.`);
                    }

                    break;
                }

                if (character === '\n') {
                    if (state.name === '') {
                        state = {
                            type: 'content',
                            boundary: state.boundary,
                            headers: state.headers,
                            index: index + 1,
                            length: 0
                        };
                        break;
                    } else {
                        throw new Error(`At ${index} (${line}:${column}): a newline in a header name '${state.name}' is not allowed.`);
                    }
                }

                if (character === ':') {
                    state = {
                        type: 'header-value',
                        boundary: state.boundary,
                        name: state.name,
                        value: '',
                        values: [],
                        headers: state.headers
                    };
                    break;
                }

                state.name += character;
                break;
            }
            case 'header-value': {
                // Check Windows newlines
                if (character === '\r') {
                    if (textDecoder.decode(uint8Array.slice(index + 1, index + 2)) !== '\n') {
                        throw new Error(`At ${index} (${line}:${column}): found an incomplete Windows newline.`);
                    }

                    break;
                }

                if (character === ';') {
                    state.values.push(state.value);
                    state.value = '';
                    break;
                }

                if (character === ' ') {
                    // Ignore white-space prior to the value content
                    if (state.value === '') {
                        break;
                    }
                }

                if (character === '\n') {
                    state.values.push(state.value);
                    state = {
                        type: 'header-name',
                        boundary: state.boundary,
                        name: '',
                        value: '',
                        headers: [{name: state.name, values: state.values}, ...state.headers]
                    };
                    break;
                }

                state.value += character;
                break;
            }
            case 'content': {
                // If the newline is followed by the boundary, then the content ends
                if (character === '\n' || character === '\r' && textDecoder.decode(uint8Array.slice(index + 1, index + 2)) === '\n') {
                    if (character === '\r') {
                        index++;
                    }

                    const boundaryCheck = textDecoder.decode(uint8Array.slice(index + '\n'.length, index + '\n'.length + state.boundary.length));
                    if (boundaryCheck === state.boundary) {
                        const conclusionCheck = textDecoder.decode(uint8Array.slice(index + '\n'.length + state.boundary.length, index + '\n'.length + state.boundary.length + '--'.length));
                        if (conclusionCheck === '--') {
                            index += '\n'.length + state.boundary.length + '--'.length;
                            yield {headers: state.headers, index: state.index, length: state.length};

                            if (index !== uint8Array.byteLength) {
                                const excess = uint8Array.slice(index);
                                if (textDecoder.decode(excess) === '\n' || textDecoder.decode(excess) === '\r\n') {
                                    return;
                                }

                                throw new Error(`At ${index} (${line}:${column}): content is present past the expected end of data ${uint8Array.byteLength}.`);
                            }

                            return;
                        } else {
                            yield {headers: state.headers, index: state.index, length: state.length};
                            state = {type: 'boundary', boundary: ''};
                            break;
                        }
                    }
                }

                state.length++;
                break;
            }
            default: {
                throw new Error(`At ${index} (${line}:${column}): invalid state ${JSON.stringify(state)}.`);
            }
        }
    }

    if (state.type !== 'content') {
        throw new Error(`At ${index} (${line}:${column}): expected content state, got ${JSON.stringify(state)}.`);
    }
};


function arrayToBlob(uint8Arrray) {
    let parts = [...parseMimeMultipart(uint8Arrray)]
    if (parts.length === 0) {
        return new Response('No parts!');
    }

    if (parts.length > 1) {
        return new Response('Too many parts!');
    }

    const [part] = parts;
    const type = part.headers.find(h => h.name === 'Content-Type')?.values[0] || 'image/png';
    const blob = uint8Arrray.slice(part.index, part.index + part.length);
    return {blob, type};
}


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
    // TODO this worked some day
    // https://github.com/TomasHubelbauer/mime-multipart/issues/1
    // let body = await request.formData();
    // let file = await body.get('file');
    // const blob = file.arrayBuffer();
    const uint8Arrray = await request.arrayBuffer();
    const {blob, type} = arrayToBlob(uint8Arrray);
    const id = makeid(10) + ".png";
    await env.spainter.put(id, blob, {
        httpMetadata: {
            "contentType": type,
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
