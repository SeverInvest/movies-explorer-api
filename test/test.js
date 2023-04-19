const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Пробуем, что тесты работают', () => {
  it('проверка работоспособности фреймворка', () => {
    assert.equal(1, 1);
  });
});

const testUser = {
  name: 'test_user',
  password: 'test_password',
  email: 'email@test.net',
};

const testLogin = {
  password: 'test_password',
  email: 'email@test.net',
};

// let testToken;
describe('проверка ендпоинтов', () => {
  before(async () => { // чистим базу до тестов
    await User.deleteMany();
  });

  after(async () => { // чистим базу после тестов
    await User.deleteMany();
  });

  describe('Регистрация пользователя', () => {
    it('зарегистрировать пользователя с валидными почтой и паролем', async () => {
      const res = await request(app).post('/signup').send(testUser);
      assert.equal(res.status, 201);
      assert.equal(res.body.name, 'test_user');
    });

    it('отказать пользователю в повторной регистрации', async () => {
      const res = await request(app).post('/signup').send(testUser);
      assert.equal(res.status, 409);
    });
  });

  describe('Авторизация пользователя', () => {
    it('залогинить пользователя уже зарегистрированного', async () => {
      const res = await request(app).post('/signin').send(testLogin);
      assert.equal(res.status, 200);
      // assert.equal(res.body.token, true);
    });
  });
});
