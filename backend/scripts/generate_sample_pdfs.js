import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleDir = path.join(__dirname, '..', 'sample_docs');

function generatePdf1() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(path.join(sampleDir, '01_user_privacy_policy.pdf'));
    doc.pipe(stream);

    // Page 1
    doc.addPage({ margin: 50 });
    doc.fontSize(16).text('USER PRIVACY & ACCOUNT MANAGEMENT POLICY', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text('Document: user-policy-v2.pdf  |  Page 1');
    doc.moveDown();
    doc.fontSize(12).text('SECTION 1: REGISTRATION & ONBOARDING');
    doc.fontSize(10).text('REQ-001: Prospective users must provide a verified corporate or personal email address.');
    doc.text('REQ-002: A 6-digit confirmation code must be emailed within 60 seconds of registration.');
    doc.text('REQ-003: User account activation occurs immediately upon confirmation code verification.');
    doc.text('REQ-004: Activated users must be granted immediate access to the dashboard portal.');

    // Page 2
    doc.addPage({ margin: 50 });
    doc.fontSize(16).text('USER PRIVACY & ACCOUNT MANAGEMENT POLICY', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text('Document: user-policy-v2.pdf  |  Page 2');
    doc.moveDown();
    doc.fontSize(12).text('SECTION 2: ACCOUNT DELETION & RIGHT TO BE FORGOTTEN');
    doc.fontSize(10).text('REQ-005: Registered users have the unconditional right to permanently delete their account at any time via settings.');
    doc.text('REQ-006: Upon confirmed deletion, the system must immediately and permanently purge all user records, transaction histories, and stored personal data within 60 seconds without delay.');
    doc.text('REQ-007: Following deletion, zero identifiable telemetry or logs shall be retained on any active or backup storage systems.');

    // Page 3
    doc.addPage({ margin: 50 });
    doc.fontSize(16).text('USER PRIVACY & ACCOUNT MANAGEMENT POLICY', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text('Document: user-policy-v2.pdf  |  Page 3');
    doc.moveDown();
    doc.fontSize(12).text('SECTION 3: SYSTEM PERFORMANCE & AVAILABILITY');
    doc.fontSize(10).text('REQ-008: The search interface and analytics dashboard should respond quickly under normal system workloads.');
    doc.text('REQ-009: The application should be highly secure against unauthorized intrusions and provide intuitive access controls.');
    doc.text('REQ-010: Users should receive email notifications regarding system updates regularly.');

    stream.on('finish', () => {
      console.log('✅ Generated 01_user_privacy_policy.pdf with PDFKit');
      resolve();
    });
    doc.end();
  });
}

function generatePdf2() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ autoFirstPage: false });
    const stream = fs.createWriteStream(path.join(sampleDir, '02_financial_compliance.pdf'));
    doc.pipe(stream);

    stream.on('finish', () => {
      console.log('✅ Generated 02_financial_compliance.pdf with PDFKit');
      resolve();
    });

    // Page 1
    doc.addPage({ margin: 50 });
    doc.fontSize(16).text('STATUTORY FINANCIAL COMPLIANCE & AUDIT SPEC', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text('Document: financial-compliance.pdf  |  Page 1');
    doc.moveDown();
    doc.fontSize(12).text('SECTION 1: STATUTORY AUDIT & DATA RETENTION');
    doc.fontSize(10).text('REQ-101: The system must log every state-changing API request and monetary transfer in an append-only audit ledger.');
    doc.text('REQ-102: All ledger entries must record user identity, IP address, timestamp, and cryptographic signatures.');
    doc.text('REQ-103: In accordance with statutory banking regulations and financial anti-fraud requirements, all financial transactions, customer transaction histories, payment invoices, and monetary audit logs must be permanently retained for a minimum mandatory period of seven years.');
    doc.text('REQ-104: Under no circumstances may transaction history records, customer ledger references, or financial audit trails be deleted, purged, or truncated prior to the expiration of the statutory seven-year retention window.');

    // Page 2
    doc.addPage({ margin: 50 });
    doc.fontSize(16).text('STATUTORY FINANCIAL COMPLIANCE & AUDIT SPEC', { underline: true });
    doc.moveDown();
    doc.fontSize(10).text('Document: financial-compliance.pdf  |  Page 2');
    doc.moveDown();
    doc.fontSize(12).text('SECTION 2: AUTHENTICATION & ACCESS CONTROL');
    doc.fontSize(10).text('REQ-105: Transfers exceeding $1,000 require two-factor authentication.');
    doc.text('REQ-106: Session tokens must be securely stored and authenticated for all sensitive transactions.');
    doc.text('REQ-107: Security audit logs must be reviewed by the compliance officer on an ongoing periodic basis.');
    doc.text('REQ-108: Users must be immediately notified of any password reset or high-value monetary transaction via SMS within 15 seconds.');

    doc.end();
  });
}

async function run() {
  await generatePdf1();
  await generatePdf2();
}

run();
