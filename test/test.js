const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Movie = require('../models/movie');

describe('Пробуем, что тесты работают', () => {
  it('проверка работоспособности фреймворка', () => {
    assert.equal(1, 1);
  });
});

const testUser = {
  name: 'test-user',
  password: 'test_password',
  email: 'email@test.net',
};

const testLogin = {
  password: 'test_password',
  email: 'email@test.net',
};

const testUser2 = {
  name: 'test-user-dva',
  password: 'test_password2',
  email: 'email2@test.net',
};

const testLogin2 = {
  password: 'test_password2',
  email: 'email2@test.net',
};

const testChangeUser = {
  name: 'test- -user',
  email: 'email_1@test.net',
};

const testMovie = {
  language: 'ru',
  director: 'Harry Potter',
  duration: '123',
  year: '1990',
  description: 'Самый лучший фильм-2',
  image: 'https://mobimg.b-cdn.net/v3/fetch/bc/bc45d1305c40e2ec7d72c71080b34751.jpeg',
  trailerLink: 'https://youtu.be/aNG-QfgwntU',
  movieId: '649ef72617006d37351dbc2b',
  name: 'МЫ',
};

const testBrokenMovie = {
  language: 'Russia',
  director: 'Harry Potter',
  duration: '123',
  year: '1990',
  description: 'Самый лучший фильм-2',
  image: '',
  trailerLink: '',
  movieId: '1234',
  name: 'МЫ',
};

const testBrokenToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDNlZWViNjcwYTE3NWZkMDA4ODk1MzEiLCJpYXQiOjE2ODE5MDIwMTksImV4cCI6MTY4MjUwNjgxOX0.nCL-hMzDcBRFIzMEwxZVjMoSXVp3LBsghtb1i77GOBg';
let testToken;
let testIdMovie;

describe('проверка ендпоинтов', () => {
  before(async () => { // чистим базу до тестов
    await User.deleteMany();
    await Movie.deleteMany();
  });

  after(async () => { // чистим базу после тестов
    await User.deleteMany();
    await Movie.deleteMany();
  });

  describe('Регистрация пользователя', () => {
    it('зарегистрировать пользователя с валидными почтой и паролем', async () => {
      const res = await request(app).post('/signup').send(testUser);
      assert.equal(res.status, 201);
      assert.equal(res.body.name, 'test-user');
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
      assert.equal(res.body.name, 'test-user');
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
      assert.equal(res.body.name, 'test- -user');
      assert.equal(res.body.email, 'email_1@test.net');
    });
  });

  describe('Добавление фильма', () => {
    it('добавить фильм с валидной информацией и правильным токеном', async () => {
      const res = await request(app).post('/movies').send(testMovie).set({
        authorization: testToken,
      });
      assert.equal(res.status, 201);
      assert.equal(res.body.language, 'ru');
      assert.equal(res.body.name, 'МЫ');
      testIdMovie = res.body._id;
    });
    it('отказать в добавлении фильма с невалидной информацией, но правильным токеном', async () => {
      const res = await request(app).post('/movies').send(testBrokenMovie).set({
        authorization: testToken,
      });
      assert.equal(res.status, 400);
    });
    it('отказать в добавлении фильма с валидной информацией, но неправильным токеном', async () => {
      const res = await request(app).post('/movies').send(testMovie).set({
        authorization: testBrokenToken,
      });
      assert.equal(res.status, 401);
    });
  });

  describe('Получить фильмы', () => {
    it('получить список фильмов (правильный токен)', async () => {
      const res = await request(app).get('/movies').set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
    });
  });

  describe('Удаление фильма', () => {
    it('удалить фильм с правильным id_movie и правильным токеном', async () => {
      const res = await request(app).delete(`/movies/${testIdMovie}`).set({
        authorization: testToken,
      });
      assert.equal(res.status, 200);
    });
    it('отказать в удалении фильма с правильным id_movie, но чужим токеном', async () => {
      // добавляем фильм под пользователем 1
      const res2 = await request(app).post('/movies').send(testMovie).set({
        authorization: testToken,
      });
      testIdMovie = res2.body._id;
      // регистрируем пользователя 2 и получаем токен
      await request(app).post('/signup').send(testUser2);
      const res = await request(app).post('/signin').send(testLogin2);
      const testToken2 = `Bearer ${res.body.token}`;
      // удаляем фильм 1-го пользователя, используя токен 2-го пользователя
      const res1 = await request(app).delete(`/movies/${testIdMovie}`).set({
        authorization: testToken2,
      });
      assert.equal(res1.status, 403);
    });
  });

  describe('Проверка отработки запроса на несуществующий роут', () => {
    it('переход на /abrakadabra для незарегистрированного пользователя - 401', async () => {
      const res = await request(app).get('/abrakadabra');
      assert.equal(res.status, 401);
    });
    it('переход на /abrakadabra для зарегистрированного пользователя - 404', async () => {
      const res = await request(app).get('/abrakadabra').set({
        authorization: testToken,
      });
      assert.equal(res.status, 404);
    });
  });
});
