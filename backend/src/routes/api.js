import express from 'express';
import { asyncHandler } from '../utils/errorHandler.js';
import { 
  getAllCustomers, 
  getCustomerById, 
  getDashboardData, 
  getInsightsData, 
  getEventsByCustomerId,
  getUsageTrendsByCustomerId,
  getTicketsByCustomerId,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAlerts,
  markAlertRead,
  getRecentAlerts,
  getAllTickets,
  getAllDevices,
  getDevicesByCustomerId
} from '../models/customerModel.js';
import { processNaturalLanguageQuery, getSmartSuggestions, resetQueryContext } from '../services/aiService.js';
import { generateEmailSummary } from '../services/emailService.js';
import { getCustomerInsight, predictChurnWithExplanation, getWeightedHealthBreakdown } from '../services/healthService.js';

const router = express.Router();

router.get('/dashboard', asyncHandler(async (req, res) => {
  const data = await getDashboardData();
  res.json({ success: true, message: 'Dashboard data retrieved', data });
}));

router.get('/customers', asyncHandler(async (req, res) => {
  const { region, plan, risk, minUsage, maxUsage, search } = req.query;
  const customers = await getAllCustomers({ region, plan, risk, minUsage, maxUsage, search });
  res.json({ success: true, count: customers.length, data: customers });
}));

router.get('/tickets', asyncHandler(async (req, res) => {
  const { severity, status, search } = req.query;
  const tickets = await getAllTickets({ severity, status, search });
  res.json({ success: true, count: tickets.length, data: tickets });
}));

router.get('/devices', asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const devices = await getAllDevices({ status, search });
  res.json({ success: true, count: devices.length, data: devices });
}));

router.get('/customers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const customer = await getCustomerById(id);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found', data: null });
  }
  res.json({ success: true, data: customer });
}));

router.post('/customers', asyncHandler(async (req, res) => {
  const { name, email, region, plan, usage, contractEndDate } = req.body;
  if (!name || !region || !plan) {
    return res.status(400).json({ success: false, message: 'Name, region, and plan are required', data: null });
  }
  const customerId = await createCustomer({ name, email, region, plan, usage, contractEndDate });
  res.json({ success: true, message: 'Customer created', data: { id: customerId } });
}));

router.put('/customers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, region, plan, usage, lastActive, contractEndDate } = req.body;
  const result = await updateCustomer(id, { name, email, region, plan, usage, lastActive, contractEndDate });
  if (!result) {
    return res.status(404).json({ success: false, message: 'Customer not found', data: null });
  }
  res.json({ success: true, message: 'Customer updated', data: { id } });
}));

router.delete('/customers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteCustomer(id);
  res.json({ success: true, message: 'Customer deleted', data: null });
}));

router.get('/customers/:id/events', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const events = await getEventsByCustomerId(id);
  res.json({ success: true, data: events });
}));

router.get('/customers/:id/usage', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const trends = await getUsageTrendsByCustomerId(id);
  res.json({ success: true, data: trends });
}));

router.get('/customers/:id/tickets', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tickets = await getTicketsByCustomerId(id);
  res.json({ success: true, data: tickets });
}));

router.get('/customers/:id/devices', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const devices = await getDevicesByCustomerId(id);
  res.json({ success: true, data: devices });
}));

router.get('/customers/:id/health', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const insight = await getCustomerInsight(id);
  res.json({ success: true, data: insight });
}));

router.get('/customers/:id/health/breakdown', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const breakdown = await getWeightedHealthBreakdown(id);
  res.json({ success: true, data: breakdown });
}));

router.get('/customers/:id/churn-prediction', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prediction = await predictChurnWithExplanation(id);
  res.json({ success: true, data: prediction });
}));

router.post('/email-summary/:customerId', asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const summary = await generateEmailSummary(customerId);
  res.json({ success: true, data: summary });
}));

router.get('/insights', asyncHandler(async (req, res) => {
  const insights = await getInsightsData();
  res.json({ success: true, data: insights });
}));

router.get('/alerts', asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const alerts = await getAlerts(parseInt(limit) || 10);
  res.json({ success: true, data: alerts });
}));

router.get('/alerts/recent', asyncHandler(async (req, res) => {
  const alerts = await getRecentAlerts();
  res.json({ success: true, data: alerts });
}));

router.patch('/alerts/:id/read', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await markAlertRead(id);
  res.json({ success: true, message: 'Alert marked as read' });
}));

router.post('/ask-ai', asyncHandler(async (req, res) => {
  const { query, sessionId } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required', data: null });
  }
  const result = await processNaturalLanguageQuery(query, sessionId || 'default');
  res.json({ success: true, data: result });
}));

router.post('/ask-ai/reset', asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  resetQueryContext(sessionId || 'default');
  res.json({ success: true, message: 'Query context reset' });
}));

router.get('/ask-ai/suggestions', asyncHandler(async (req, res) => {
  const suggestions = await getSmartSuggestions();
  res.json({ success: true, data: suggestions });
}));

export default router;