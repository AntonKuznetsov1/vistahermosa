"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const services_1 = __importDefault(require("./routes/services"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const timeSlots_1 = __importDefault(require("./routes/timeSlots"));
const blog_1 = __importDefault(require("./routes/blog"));
const email_1 = __importDefault(require("./routes/email"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'Vista Hermosa Beauty Salon API' });
});
app.use('/api/services', services_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/time-slots', timeSlots_1.default);
app.use('/api/blog', blog_1.default);
app.use('/api/email', email_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
