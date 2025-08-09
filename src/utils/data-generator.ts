import { faker } from '@faker-js/faker';
import { User, BillPayment } from '../types';

export class DataGenerator {
  static generateUniqueUsername(
    suffix: string = '',
    suffix_1: string = '',
    suffix_len: number = 6
  ): string {
    // firstname + lastname + 6 ramdom, ensure unique in every test
    // const firstname = faker.person.firstName();
    // const lastName = faker.person.lastName();
    // NB: use alphanumeric will prompt username existing
    const random_num = faker.string.numeric(suffix_len);
    return `${suffix}${suffix_1}${random_num}`.toLowerCase();
  }

  static generateUser(): User {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const _username = this.generateUniqueUsername(firstName, lastName);
    const _password = process.env.DEFAULT_PASSWORD || 'Fabric!@#';
    return {
      firstName: firstName,
      lastName: lastName,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      phoneNumber: faker.phone.number(),
      ssn: faker.string.numeric(9),
      username: _username,
      password: _password,
    };
  }

  static generateBillPayment(fromAccountId: string): BillPayment {
    // Will be set to same as accountNumber
    const accountNumber = faker.string.numeric(10);
    return {
      payeeName: faker.company.name(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      phoneNumber: faker.phone.number(),
      accountNumber: accountNumber,
      verifyAccountNumber: accountNumber,
      amount: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
      fromAccountId,
    };
  }
}
