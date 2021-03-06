import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { v4 } from 'uuid';
import IUsersTokenRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUsersTokenRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      singleToken => singleToken.token === token,
    );

    return userToken;
  }
}

export default FakeUserTokensRepository;
