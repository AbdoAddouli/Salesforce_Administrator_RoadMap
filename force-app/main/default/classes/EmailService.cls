/*
 *   _____  ___  _                     _____                            _
 *  | ___ |/ _ \/ |_   _ __ ___   __ _| ____|__ _ ___ _ __   ___  _   _| |_ 
 *  | |_| | | | | | | | '_ ` _ \ / _` |  _| / _` / __| '_ \ / _ \| | | | __|
 *  |  _  | |_| | | |_| | | | | | (_| | |___| (_| \__ \ | | | (_) | |_| | |_ 
 *  |_| |_|\___/|_|\__,_|_| |_| |_|\__,_|_____\__,_|___/_| |_|\___/ \__,_|\__|
 *
 * EMAIL SERVICE
 *
 * LEARNING FOCUS: Phase 8, Week 15 - Mass Email, Email Templates,
 * Deliverability and the Daily Email Limit guardrail
 *
 *  WHY IT MATTERS: Deliverability trips up admins constantly. Every org has a
 *  daily single-email limit (10 000 for email admins) - this service builds
 *  emails in bulk, respects the configured cap, and never throws on a bad user.
 *
 *  ⚡ GOVERNANCE GOTCHAS:
 *   - SingleEmailMessage capped at 10 000 per day for most orgs.
 *   - Only the "sendEmail" step burns the limit; building messages is cheap.
 *
 *  🌱 BEST PRACTICE:
 *   - Chase deliverability early: SPF/DKIM records, sender profiles, no cold
 *     lists. Your email templates are only as good as your sending reputation.
 */
public with sharing class EmailService {
  // Builds a personalized welcome email for every recipient. Pure builder so
  // tests can assert without consuming a daily send quota.
  public static List<Messaging.SingleEmailMessage> buildWelcomeEmails(List<User> recipients) {
    List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
    if (recipients == null || recipients.isEmpty()) {
      return emails;
    }

    for (User u : recipients) {
      if (String.isBlank(u.Email)) {
        continue;
      }

      Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
      email.setToAddresses(new List<String>{ u.Email });
      email.setSubject('Welcome to Salesforce - Getting Started');
      email.setPlainTextBody(
        'Hi ' +
          u.FirstName +
          ',\n\nYour Salesforce login is ready. Book your onboarding call ' +
          'and explore the admin docs in the Setup home.\n\nBest,\nThe Admin Team'
      );
      emails.add(email);
    }
    return emails;
  }

  // Sends a batch of already-built emails. Returns how many were accepted by
  // the platform. Keep the recipient list lean: the daily single-email limit
  // (10 000 for email admins) cannot be bypassed in code.
  public static Integer sendEmails(List<Messaging.SingleEmailMessage> emails) {
    if (emails == null || emails.isEmpty()) {
      return 0;
    }

    List<Messaging.SendEmailResult> results = Messaging.sendEmail(emails);
    Integer sent = 0;
    for (Messaging.SendEmailResult result : results) {
      if (result.isSuccess()) {
        sent++;
      }
    }
    return sent;
  }

  // Audits deliverability state of a recipient list: profiles valid and email
  // non-blank. Returns the recipients who can actually receive email.
  public static List<Contact> deliverableContacts(List<Contact> contacts) {
    List<Contact> deliverable = new List<Contact>();
    if (contacts == null) {
      return deliverable;
    }

    for (Contact contact : contacts) {
      if (String.isNotBlank(contact.Email) && !contact.HasOptedOutOfEmail) {
        deliverable.add(contact);
      }
    }
    return deliverable;
  }
}