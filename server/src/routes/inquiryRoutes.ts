import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const inquiryRouter = Router();

const INQUIRIES_FILE = path.join(__dirname, '../../data/inquiries_data.json');

interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'contacted' | 'resolved';
}

function loadInquiries(): ContactInquiry[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading inquiries from disk:', err);
  }
  return [];
}

function saveInquiries(inquiries: ContactInquiry[]) {
  try {
    const dir = path.dirname(INQUIRIES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving inquiries to disk:', err);
  }
}

// GET /api/inquiries - List all inquiries
inquiryRouter.get('/', (_req: Request, res: Response) => {
  try {
    const inquiries = loadInquiries();
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
});

// POST /api/inquiries - Submit a new inquiry
inquiryRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, phone, email, inquiryType, message, id } = req.body;
    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }

    const newInquiry: ContactInquiry = {
      id: id || `INQ-${Date.now()}`,
      name: String(name).trim(),
      phone: String(phone || '').trim(),
      email: String(email || '').trim(),
      inquiryType: String(inquiryType || 'customer'),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    const inquiries = loadInquiries();
    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);

    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save inquiry' });
  }
});

// PATCH /api/inquiries/:id - Update status (e.g. read/unread)
inquiryRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiries = loadInquiries();
    const target = inquiries.find((i) => i.id === id);

    if (!target) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (status) {
      target.status = status;
    }
    saveInquiries(inquiries);

    res.json({ success: true, inquiry: target });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update inquiry' });
  }
});

// DELETE /api/inquiries/:id - Delete an inquiry
inquiryRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let inquiries = loadInquiries();
    const initialLength = inquiries.length;
    inquiries = inquiries.filter((i) => i.id !== id);

    if (inquiries.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    saveInquiries(inquiries);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
  }
});
