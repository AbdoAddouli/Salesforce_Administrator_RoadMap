/*
 * EMAIL SERVICE TEST
 *
 * LEARNING FOCUS: Phase 8, Week 15 - Testing email builders without burning
 * the daily send quota (Messaging.sendEmail returns a stub success in tests).
 */
@isTest
private class EmailServiceTest {
  @isTest
  static void testBuildWelcomeEmails() {
    User u = buildTestUser('EmailMe');
    insert u;

    List<Messaging.SingleEmailMessage> emails = EmailService.buildWelcomeEmails(new List<User>{ u });
    System.assertEquals(1, emails.size(), 'One recipient, one message.');
    System.assertEquals(u.Email, emails[0].getToAddresses()[0]);
  }

  @isTest
  static void testBuildWelcomeEmailsSkipsBlankEmails() {
    User noEmail = new User(Email = null);
    List<Messaging.SingleEmailMessage> emails = EmailService.buildWelcomeEmails(new List<User>{ noEmail });
    System.assertEquals(0, emails.size(), 'Users without an email get no message.');
  }

  @isTest
  static void testSendEmailsSucceedsInTestContext() {
    User u = buildTestUser('SendMe');
    insert u;

    List<Messaging.SingleEmailMessage> emails = EmailService.buildWelcomeEmails(new List<User>{ u });
    Integer sent = EmailService.sendEmails(emails);
    System.assertEquals(1, sent, 'In tests, Messaging.sendEmail reports success without delivering.');
  }

  @isTest
  static void testDeliverableContacts() {
    List<Contact> contacts = new List<Contact>{
      new Contact(LastName = 'Ok', Email = 'ok@example.com'),
      new Contact(LastName = 'OptedOut', Email = 'no@example.com', HasOptedOutOfEmail = true),
      new Contact(LastName = 'NoMail', Email = null)
    };

    List<Contact> deliverable = EmailService.deliverableContacts(contacts);
    System.assertEquals(1, deliverable.size(), 'Only the reachable contact is delivered.');
    System.assertEquals('Ok', deliverable[0].LastName);
  }

  private static User buildTestUser(String lastName) {
    Profile standardProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
    return new User(
      Alias = lastName.left(8),
      Email = lastName.toLowerCase() + '@roadmap.example.com',
      EmailEncodingKey = 'UTF-8',
      LastName = lastName,
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US',
      TimeZoneSidKey = 'America/Los_Angeles',
      ProfileId = standardProfile.Id,
      Username = lastName.toLowerCase() + System.currentTimeMillis() + '@roadmap.example.com'
    );
  }
}