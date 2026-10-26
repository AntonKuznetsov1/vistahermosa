import express from 'express';
import { supabase } from '../lib/supabase';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get like counts for each post
    const postsWithLikes = await Promise.all(
      (posts || []).map(async (post) => {
        const { count } = await supabase
          .from('blog_likes')
          .select('*', { count: 'exact', head: true })
          .eq('blog_post_id', post.id);
        
        return { ...post, like_count: count || 0 };
      })
    );
    
    res.json(postsWithLikes);
  } catch (error: any) {
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
      const fileName = `${uuidv4()}.${fileExt}`;
      image_path = fileName;
      
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      
      image_url = urlData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ title, description, image_url, image_path }])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updateData: any = { title, description, updated_at: new Date().toISOString() };
    
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      
      updateData.image_url = urlData.publicUrl;
      updateData.image_path = fileName;
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get post to delete image
    const { data: post } = await supabase
      .from('blog_posts')
      .select('image_path')
      .eq('id', id)
      .single();
    
    if (post?.image_path) {
      await supabase.storage
        .from('blog-images')
        .remove([post.image_path]);
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_identifier } = req.body;
    
    // Check if already liked
    const { data: existing } = await supabase
      .from('blog_likes')
      .select('*')
      .eq('blog_post_id', id)
      .eq('client_identifier', client_identifier)
      .single();
    
    if (existing) {
      // Unlike
      const { error } = await supabase
        .from('blog_likes')
        .delete()
        .eq('blog_post_id', id)
        .eq('client_identifier', client_identifier);
      
      if (error) throw error;
      res.json({ liked: false });
    } else {
      // Like
      const { error } = await supabase
        .from('blog_likes')
        .insert([{ blog_post_id: id, client_identifier }]);
      
      if (error) throw error;
      res.json({ liked: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/like-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_identifier } = req.query;
    
    const { data } = await supabase
      .from('blog_likes')
      .select('*')
      .eq('blog_post_id', id)
      .eq('client_identifier', client_identifier as string)
      .single();
    
    res.json({ liked: !!data });
  } catch (error: any) {
    res.json({ liked: false });
  }
});

export default router;
