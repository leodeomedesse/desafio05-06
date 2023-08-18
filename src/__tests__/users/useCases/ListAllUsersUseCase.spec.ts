import { v4 } from "uuid";

import { UsersRepository } from "../../../modules/users/repositories/implementations/UsersRepository";
import { ListAllUsersUseCase } from "../../../modules/users/useCases/listAllUsers/ListAllUsersUseCase";

describe("ListAllUsersUseCase", () => {
  let usersRepository: UsersRepository;
  let listAllUsersUseCase: ListAllUsersUseCase;
  let userId: string;

  beforeAll(() => {
    usersRepository = UsersRepository.getInstance();
    listAllUsersUseCase = new ListAllUsersUseCase(usersRepository);
  });

  it("should be able to list all users", () => {
    const user1 = usersRepository.create({
      name: "Mariana Castan",
      email: "mari.castan@voicce.com.br",
    });

    const user2 = usersRepository.create({
      name: "Vinicius Fraga",
      email: "vinifraga@rocketseat.com",
    });

    userId = user2.id;

    const user3 = usersRepository.create({
      name: "Eduardo Santos",
      email: "eduardo.santos@voicce.com.br",
    });

    usersRepository.turnAdmin(user1);

    const users = listAllUsersUseCase.execute({ user_id: user1.id });

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Mariana Castan",
          email: "mari.castan@voicce.com.br",
        }),
        user2,
        user3,
      ])
    );
  });

  it("should not be able to a non admin user get list of all users", () => {
    expect(() => {
      listAllUsersUseCase.execute({ user_id: userId });
    }).toThrow();
  });

  it("should not be able to a non existing user get list of all users", () => {
    expect(() => {
      listAllUsersUseCase.execute({ user_id: v4() });
    }).toThrow();
  });
});
