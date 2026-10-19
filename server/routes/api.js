import express from 'express';
import * as authController from '../controllers/authController.js';
import * as schemesController from '../controllers/schemesController.js';
import * as customersController from '../controllers/customersController.js';
import * as applicationsController from '../controllers/applicationsController.js';
import * as loansController from '../controllers/loansController.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// 1. Auth Endpoints
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.registerCustomer);
router.get('/auth/users', authController.getUsers);

// 2. Loan Schemes / Products Endpoints
router.get('/schemes', schemesController.getSchemes);
router.get('/schemes/:id', schemesController.getSchemeById);
router.post('/schemes', schemesController.createScheme);
router.put('/schemes/:id', schemesController.updateScheme);

// 3. Customers / Borrowers Endpoints
router.get('/customers', customersController.getCustomers);
router.get('/customers/:id', customersController.getCustomerById);
router.put('/customers/:id', customersController.updateCustomer);

// 4. Loan Applications Endpoints
router.get('/applications', applicationsController.getApplications);
router.get('/applications/:id', applicationsController.getApplicationById);
router.post('/applications', applicationsController.submitApplication);
router.patch('/applications/:id/stage', applicationsController.advanceStage);
router.patch('/applications/:id/documents/:docId', applicationsController.updateDocStatus);
router.post('/applications/:id/sanction', applicationsController.sanctionApplication);
router.post('/applications/:id/reject', applicationsController.rejectApplication);
router.post('/applications/:id/disburse', applicationsController.disburseApplication);

// 5. Active Loans & EMI Payments Endpoints
router.get('/loans', loansController.getLoans);
router.get('/loans/:id', loansController.getLoanById);
router.post('/loans/:id/pay-emi', loansController.payEmi);
router.get('/transactions', loansController.getTransactions);

// 6. Analytics & System Endpoints
router.get('/analytics/dashboard', analyticsController.getDashboardAnalytics);
router.post('/system/reset', analyticsController.resetSystemDatabase);

export default router;
