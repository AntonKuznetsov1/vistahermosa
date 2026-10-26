"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../lib/supabase");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: true });
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const { data, error } = await supabase_1.supabase
            .from('services')
            .insert([{ title, description, price: price || null }])
            .select();
        if (error)
            throw error;
        res.json(data[0]);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;
        const { data, error } = await supabase_1.supabase
            .from('services')
            .update({ title, description, price: price || null })
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
        const { error } = await supabase_1.supabase
            .from('services')
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
exports.default = router;
