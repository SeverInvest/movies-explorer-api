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

const testChangeUser = {
  name: 'test_1_user',
  email: 'email_1@test.net',
};

const testBrokenToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDNlZWViNjcwYTE3NWZkMDA4ODk1MzEiLCJpYXQiOjE2ODE5MDIwMTksImV4cCI6MTY4MjUwNjgxOX0.nCL-hMzDcBRFIzMEwxZVjMoSXVp3LBsghtb1i77GOBg';
let testToken;

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
      testToken = `Bearer ${res.body.token}`;
    });
  });

  describe('Получение информации о текущем пользователе', () => {
    it('получить информацию о пользователе по токену', async () => {
      const res = await request(app).get('/users/me').set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'test_user');
      assert.equal(res.body.email, 'email@test.net');
    });

    it('отказать в получении информации пользователю с недействующим токеном', async () => {
      const res = await request(app).get('/users/me').set({
        authorization: testBrokenToken,
      });
      assert.equal(res.status, 401);
    });
  });

  describe('Изменение имени и почты текущего пользователя', () => {
    it('изменить информацию о пользователе по токену', async () => {
      const res = await request(app).patch('/users/me').send(testChangeUser).set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'test_1_user');
      assert.equal(res.body.email, 'email_1@test.net');
    });
  });
});
