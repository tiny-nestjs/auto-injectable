import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from './test.service';
import { CatService } from '../cat/cat.service';
import { Cat } from '../cat/cat.interface';

const catServiceMock = {
  create: jest.fn(),
  findAll: jest.fn().mockReturnValue([{ name: 'Kitty', age: 2 }]),
};

describe('TestService', () => {
  let testService: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        { provide: CatService, useValue: catServiceMock },
      ],
    }).compile();

    testService = module.get<TestService>(TestService);
  });

  afterEach(() => {
    // 각 테스트 이후에 모의 객체의 메서드 호출 횟수를 초기화합니다.
    jest.clearAllMocks();
  });

  it('should call CatService create method with correct argument', () => {
    const cat: Cat = { name: 'cat', age: 1 };
    testService.testCreateCat(cat);
    expect(catServiceMock.create).toHaveBeenCalledWith(cat);
  });

  it('should return an array of cats', () => {
    const cats = testService.testGetCats();
    expect(cats).toEqual([{ name: 'Kitty', age: 2 }]);
  });
});
