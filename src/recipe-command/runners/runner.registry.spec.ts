import { ICommandRunner } from './command-runner.interface';
import { RecipeRunner, RunnerRegistry } from './runner.registry';

describe('RunnerRegistry', () => {
  beforeEach(() => {
    RunnerRegistry['runners'] = [];
  });

  describe('register', () => {
    it('validator를 등록해야 합니다', () => {
      @RecipeRunner()
      class TestRunner implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      expect(RunnerRegistry.getRunners()).toContain(TestRunner);
    });

    it('여러 validator를 등록할 수 있어야 합니다', () => {
      @RecipeRunner()
      class TestRunner1 implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      @RecipeRunner()
      class TestRunner2 implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      const runners = RunnerRegistry.getRunners();
      expect(runners).toContain(TestRunner1);
      expect(runners).toContain(TestRunner2);
      expect(runners.length).toBe(2);
    });
  });

  describe('getRunners', () => {
    it('등록된 모든 validator를 반환해야 합니다', () => {
      @RecipeRunner()
      class TestRunner1 implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      @RecipeRunner()
      class TestRunner2 implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      const runners = RunnerRegistry.getRunners();
      expect(runners).toEqual([TestRunner1, TestRunner2]);
    });

    it('validator가 등록되지 않았을 때 빈 배열을 반환해야 합니다', () => {
      const runners = RunnerRegistry.getRunners();
      expect(runners).toEqual([]);
    });
  });

  describe('RecipeValidator 데코레이터', () => {
    it('클래스에 데코레이터를 적용하면 ValidatorRegistry에 등록되어야 합니다', () => {
      @RecipeRunner()
      class TestRunner implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      const runners = RunnerRegistry.getRunners();
      expect(runners).toContain(TestRunner);
      expect(runners.length).toBe(1);
    });

    it('여러 클래스에 데코레이터를 적용할 수 있어야 합니다', () => {
      @RecipeRunner()
      class TestRunner1 implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      @RecipeRunner()
      class TestRunner2 implements ICommandRunner {
        canHandle(): boolean {
          return true;
        }
        async execute(): Promise<void> {
          return;
        }
      }

      const runners = RunnerRegistry.getRunners();
      expect(runners).toContain(TestRunner1);
      expect(runners).toContain(TestRunner2);
    });
  });
});
