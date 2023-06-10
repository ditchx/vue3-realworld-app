import { describe, it, expect, vi } from 'vitest'
import { useUser, type User, emptyUser } from '@/services/users'
import { flushPromises } from '@vue/test-utils';
import axios from 'axios';

vi.mock('axios')

describe('useUser composable', () => {
    const mockUser: User = {
        email: "test@email.com",
        token: "1234.5678.89000",
        username: "test",
        bio: "bioman",
        image: "myimage",
    }

    it('can login user', async () => {
        vi.mocked(axios, true).post.mockReset()

        vi.mocked(axios, true).post.mockResolvedValue({
            data: {
                user: mockUser
            }

        })

        const { currentUser, isLoggedIn, login } = useUser()

        expect(currentUser.value).toStrictEqual(emptyUser())
        expect(isLoggedIn.value).toBe(false)

        login(mockUser.email, "test1234")
        await flushPromises()

        expect(currentUser.value).toStrictEqual(mockUser)
        expect(isLoggedIn.value).toBe(true)

    })

    it('can logout user', async () => {
        const { currentUser, isLoggedIn, logout } = useUser()

        currentUser.value = mockUser
        expect(isLoggedIn.value).toBe(true)

        logout();

        expect(currentUser.value).toStrictEqual(emptyUser())
        expect(isLoggedIn.value).toBe(false)

    })


});