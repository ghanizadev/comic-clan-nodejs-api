# Uploading files to a post/comment

---

## Why not in post (or comment) creation?

Upload a file may take a long time, so, to save time and for better user experience, it's possible to load files first while the post is edited. Also, it allow to user to post instantly, asynchronously while it uploads its pictures/videos.

## Linking media to a post comment

When the upload finishes, an identifier of these files will be returned in response to this request. This can be linked to the original post with another HTTP request, like follows:

```js
const linkMedia = media =>
    axios.put('http://[ApiAddressHere]:[Port]/posts/[PostId]', 
        { media },
        {
        headers: {
            Authorization: 'Bearer [token]',
            "Content-Type": 'application/json',
        }
    })

const uploadFiles = files => {
    const FormData = require('form-data');

    //[...]

    const form = new FormDAta();

    if(Array.isArray(files)){
        files.forEach(file => form.append('media', file));
    } else form.append('media', files);

    return axios.post('http://[ApiAddressHere]:[Port]/posts/[PostId]',
    form,
    { headers: form.getHeaders() })
    .then(res => {
        if(res.statusCode === 201){
            linkMedia(res.data);
            // Upload finished successfully!
        }
    })
}
```

> Attention: Media files unlinked until 24h will be completely deleted by the garbage collector.

After linking media to a post or comment, it will receive a new URL address according to pattern `{hash}_{timestamp}_{postId}.{extension}`.

### Notes

- Media of deleted posts or comment will be removes within 24h, following the same principle.
- It is not possible to remove media from the server. It is recommended to alter the post's "media" field instead.
