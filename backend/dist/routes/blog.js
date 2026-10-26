"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../lib/supabase");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.get('/', async (req, res) => {
    try {
        const { data: posts, error } = await supabase_1.supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        // Get like counts for each post
        const postsWithLikes = await Promise.all((posts || []).map(async (post) => {
            const { count } = await supabase_1.supabase
                .from('blog_likes')
                .select('*', { count: 'exact', head: true })
                .eq('blog_post_id', post.id);
            return { ...post, like_count: count || 0 };
        }));
        res.json(postsWithLikes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        let image_url = null;
        let image_path = null;
        if (req.file) {
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
            image_path = fileName;
            const { error: uploadError } = await supabase_1.supabase.storage
                .from('blog-images')
                .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype
            });
            if (uploadError)
                throw uploadError;
            const { data: urlData } = supabase_1.supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName);
            image_url = urlData.publicUrl;
        }
        const { data, error } = await supabase_1.supabase
            .from('blog_posts')
            .insert([{ title, description, image_url, image_path }])
            .select();
        if (error)
            throw error;
        res.json(data[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updateData = { title, description, updated_at: new Date().toISOString() };
        if (req.file) {
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
            const { error: uploadError } = await supabase_1.supabase.storage
                .from('blog-images')
                .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype
            });
            if (uploadError)
                throw uploadError;
            const { data: urlData } = supabase_1.supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName);
            updateData.image_url = urlData.publicUrl;
            updateData.image_path = fileName;
        }
        const { data, error } = await supabase_1.supabase
            .from('blog_posts')
            .update(updateData)
            .eq('id', id)
            .select();
        if (error)
            throw error;
        res.json(data[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Get post to delete image
        const { data: post } = await supabase_1.supabase
            .from('blog_posts')
            .select('image_path')
            .eq('id', id)
            .single();
        if (post?.image_path) {
            await supabase_1.supabase.storage
                .from('blog-images')
                .remove([post.image_path]);
        }
        const { error } = await supabase_1.supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        const { client_identifier } = req.body;
        // Check if already liked
        const { data: existing } = await supabase_1.supabase
            .from('blog_likes')
            .select('*')
            .eq('blog_post_id', id)
            .eq('client_identifier', client_identifier)
            .single();
        if (existing) {
            // Unlike
            const { error } = await supabase_1.supabase
                .from('blog_likes')
                .delete()
                .eq('blog_post_id', id)
                .eq('client_identifier', client_identifier);
            if (error)
                throw error;
            res.json({ liked: false });
        }
        else {
            // Like
            const { error } = await supabase_1.supabase
                .from('blog_likes')
                .insert([{ blog_post_id: id, client_identifier }]);
            if (error)
                throw error;
            res.json({ liked: true });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:id/like-status', async (req, res) => {
    try {
        const { id } = req.params;
        const { client_identifier } = req.query;
        const { data } = await supabase_1.supabase
            .from('blog_likes')
            .select('*')
            .eq('blog_post_id', id)
            .eq('client_identifier', client_identifier)
            .single();
        res.json({ liked: !!data });
    }
    catch (error) {
        res.json({ liked: false });
    }
});
exports.default = router;
