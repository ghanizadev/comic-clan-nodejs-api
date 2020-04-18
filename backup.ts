const results = await Promise.all(

            posts.payload.docs.map(async(post: { userId: string; user: any; comments : any[]; }) => {

                await eventHandler.publish('users_ch', {
                    body: {query: {_id: post.userId}},
                    event: 'list',
                })
                .then(({ payload }) => {
                    if(payload.length === 0) return;

                    post.user = polish(payload.shift());
                })
                .catch(next);

                await eventHandler.publish('comments_ch', {
                    body: {query: {_id: {$in : post.comments } }},
                    event: 'list',
                })
                .then(async ({ payload }) => {
                    post.comments = [];

                    if(payload.docs.length === 0) {
                        return;
                    }

                    await Promise.all(
                        payload.docs.map(async (comment: { userId: string; user : any, comments: any[]}) => {

                            return await eventHandler.publish('users_ch', {
                                body: {query: {_id: comment.userId}},
                                event: 'list',
                            })
                            .then(async ({ payload }) => {

                                if(payload.length === 0) return;
                                comment.user = polish(payload.shift());
                                delete comment.userId;

                                await Promise.all(comment.comments.map(async sub => {
                                    return await eventHandler.publish('comments_ch', {
                                        body: {query: {_id: sub}},
                                        event: 'list',
                                    })
                                    .then(async (subcomment) => {
                                        comment.comments = [];
                                        if(subcomment.payload.docs.length === 0){
                                            return;
                                        };

                                        return await eventHandler.publish('users_ch', {
                                            body: {query: {_id: subcomment.payload.docs[0].userId}},
                                            event: 'list',
                                        })
                                        .then((user) => {
                                            if(user.payload.length === 0) return;

                                            subcomment.payload.docs[0].user = polish(user.payload.docs.shift());
                                            comment.comments.push(subcomment.payload[0])
                                        })
                                        .catch(next)
                                    })
                                    .catch(next)
                                }))

                                post.comments.push(comment);
                            })
                            .catch(next);
                        })
                    )
                })
                .catch(next);

                return post;
            })
        );

        const r : any[] = []

        results.forEach(e => {
            if(e) r.push(polish(e));
        });

        posts.payload.docs = r;

        res.status(posts.status).send(posts.payload);
