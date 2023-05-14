const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Post = require('../models/Post')

// @route GET api/posts
// @desc Get posts
// @access Private
router.get('/', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({ author: req.userId }).populate('author', [
            'name'
        ])
        res.json({ success: true, posts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async(req, res) => {
    const { title, content } = req.body

    if (!title) {
        return res.status(403).json({ success: false, message: 'you must be provide title' })
    }
    if (!(content.length > 6)) {
        return res.status(403).json({ success: false, message: 'you must be provide content' })
    }



    try {
        const newPost = new Post({
            title,
            content,
            author: req.userId,

        })

        await newPost.save()

        res.json({ success: true, message: 'Happy learning!', post: newPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/:id', verifyToken, async(req, res) => {
    const { title, content, published } = req.body

    // Simple validation
    if (!title) {
        return res.status(403).json({ success: false, message: 'you must be provide title' })
    }
    if (!(content.length > 6)) {
        return res.status(403).json({ success: false, message: 'you must be provide content' })
    }


    try {
        let updatedPost = {
            title,
            content,
            published: published ? published : false
        }

        const postUpdateCondition = { _id: req.params.id, author: req.userId }

        const post = await Post.findOne(postUpdateCondition)
        if (!post) {
            return res.status(404).json({ success: false, message: 'post not found' })
        }

        const newupdatedPost = await Post.findOneAndUpdate(
            postUpdateCondition,
            updatedPost, { new: true }
        )

        // User not authorised to update post or post not found
        if (!newupdatedPost)
            return res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised'
            })

        res.json({
            success: true,
            message: 'updated post was successfully updated',
            post: newupdatedPost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async(req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id, author: req.userId }
        const post = await Post.findOne(postDeleteCondition)

        if (!post) {
            return res.status(404).json({ success: false, message: 'post not found' })
        }

        const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

        // User not authorised or post not found
        if (!deletedPost)
            return res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised'
            })

        res.json({ success: true, message: 'delete post success', post: deletedPost })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router