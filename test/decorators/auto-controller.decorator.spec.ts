import { AUTO_CONTROLLER_WATERMARK, AutoController } from '../../lib';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { Get, INestApplication, Post } from '@nestjs/common';

// 테스트용 컨트롤러를 생성합니다.
@AutoController('test')
class TestController {
  @Get()
  getHello() {
    return 'Hello, Get!';
  }

  @Post()
  getHello2() {
    return 'Hello, Post!';
  }
}

describe('AutoController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();
  });

  describe('decorator test', () => {
    it('should apply the AUTO_CONTROLLER_WATERMARK metadata', () => {
      const controller = app.get(TestController);
      expect(Reflect.getMetadata(AUTO_CONTROLLER_WATERMARK, controller.constructor)).toBe(true);
    });

    it('should apply the path metadata to the method', () => {
      const controller = app.get(TestController);
      expect(Reflect.getMetadata('path', controller.getHello)).toBe('/');
    });

    it('should apply the method metadata to the method', () => {
      const controller = app.get(TestController);
      expect(Reflect.getMetadata('method', controller.getHello)).toBe(0);
    });

    it('should apply the path metadata to the method', () => {
      const controller = app.get(TestController);
      expect(Reflect.getMetadata('path', controller.getHello2)).toBe('/');
    });

    it('should apply the method metadata to the method', () => {
      const controller = app.get(TestController);
      expect(Reflect.getMetadata('method', controller.getHello2)).toBe(1);
    });

    it('should return "Hello Get!"', () => {
      const controller = app.get<TestController>(TestController);
      expect(controller.getHello()).toBe('Hello, Get!');
    });

    it('should return "Hello Post!"', () => {
      const controller = app.get<TestController>(TestController);
      expect(controller.getHello2()).toBe('Hello, Post!');
    });
  });
  describe('E2E test', () => {
    let httpServer: INestApplication<any>;
    beforeAll(async () => {
      httpServer = app.createNestApplication();
      await httpServer.init();
    });

    it('should return "Hello Get!"', async () => {
      return request(httpServer.getHttpServer()).get('/test').expect(200, 'Hello, Get!');
    });

    it('should return "Hello Post!"', async () => {
      return request(httpServer.getHttpServer()).post('/test').expect(201, 'Hello, Post!');
    });

    afterAll(async () => {
      await httpServer.close();
    });
  });
});
