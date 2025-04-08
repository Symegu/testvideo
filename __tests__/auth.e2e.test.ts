import { req, setupDb, teardownDb } from './test-helpers';
import { SETTINGS } from '../src/settings';
import { SecurityRepository } from '../src/modules/security/securityRepository';
import mongoose from 'mongoose';
import { codedAuth } from './datasets';
import { UserModelClass } from '../src/db/mongoDb';

const securityRepository = new SecurityRepository();

describe('Auth Endpoints Tests', () => {
    let userId: string;
    let accessToken: string;
    let refreshToken: string;
    let recoveryCode: string;

    beforeAll(async () => {
        jest.setTimeout(20000)
        await setupDb()
        console.log('Starting user registration');
        const user = await req
            .post(SETTINGS.PATH.USERS)
            .set({ 'Authorization': 'Basic ' + codedAuth })
            .send({
                login: 'testUser',
                password: 'password',
                email: 'testuser@mail.com',
            });
        console.log('User registered', user);

        userId = user.body.id;

        // авторизуем пользователя
        const loginResponse = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: 'testuser@mail.com',
                password: 'password',
            });

        accessToken = loginResponse.body.accessToken;
        refreshToken = loginResponse.headers['set-cookie'][0];

        //создаем recovery-код
        recoveryCode = await securityRepository.createRandomUID();
        await securityRepository.createRecoveryCode(userId, recoveryCode);
    });

    afterAll(async () => {
        jest.setTimeout(10000)
        await teardownDb()
        await UserModelClass.deleteMany({})
        await securityRepository.deleteRecoveryCode(recoveryCode);
        // удаляем пользователя
        await req.delete(SETTINGS.PATH.AUTH + `/${userId}`);
        mongoose.disconnect()
    });

    test('should register a new user', async () => {
        const response = await req
            .post(SETTINGS.PATH.AUTH + '/registration')
            .send({
                login: 'newUser',
                password: 'password',
                email: 'newuser@mail.com',
            });

        expect(response.status).toBe(204)
    });

    test('should login user and get access token', async () => {
        const response = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: 'testuser@mail.com',
                password: 'password',
            });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    });

    test('should fail login with wrong credentials', async () => {
        const response = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send({
                loginOrEmail: 'wronguser@mail.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401)
    });

    test('should create a recovery code and find it', async () => {
        const foundCode = await securityRepository.findRecoveryCode(recoveryCode);
        expect(foundCode).not.toBeNull();
        if (foundCode !== null) {
            expect(foundCode.code).toBe(recoveryCode);
            expect(foundCode.userId).toBe(userId); // Проверяем, что recovery-код принадлежит правильному пользователю
        }
    });

    test('should delete a recovery code', async () => {
        const result = await securityRepository.deleteRecoveryCode(recoveryCode);
        expect(result).toBe(true);

        const foundCode = await securityRepository.findRecoveryCode(recoveryCode);
        expect(foundCode).toBeNull(); // проверяем, что код действительно удалён
    });

    test('should fail password recovery with invalid code', async () => {
        const invalidCode = 'invalidCode';
        const response = await req
            .post(SETTINGS.PATH.AUTH + '/new-password')
            .send({ password: 'newPass', recoveryCode: invalidCode });

        expect(response.status).toBe(400);
    });

    // test('should successfully change password with recovery code', async () => {
    //     const response = await req
    //         .post(SETTINGS.PATH.AUTH + '/new-password')
    //         .send({ password: 'newPass', recoveryCode: recoveryCode });

    //     expect(response.status).toBe(200)
    // });

    // test('should logout user', async () => {
    //     const response = await req
    //         .post(SETTINGS.PATH.AUTH + '/logout')
    //         .set('Authorization', `Bearer ${accessToken}`)

    //     expect(response.status).toBe(204);
    // });
});
