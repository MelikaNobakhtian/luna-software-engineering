import Home from './home';
import { get } from 'axios';

jest.mock('axios');

it('returns the title of the first album', async () => {
  get.mockResolvedValue({
            doctors: [
                    {
                        id: "15",
                        user: {
                            "id": 28,
                            "password": "pbkdf2_sha256$216000$NsKTzsQCFHmy$SHNr8kvIjMpqIozqeu5aYc63qfNMdYY9Lwf2yoK4Qns=",
                            "last_login": null,
                            "is_superuser": false,
                            "username": "FAhm",
                            "first_name": "F",
                            "last_name": "Omid",
                            "email": "fateme.ahmadi1522@gmail.com",
                            "profile_photo": "/media/default.png",
                            "is_verified": false,
                            "is_staff": false,
                            "created": "2021-04-22T17:39:21.715630Z",
                            "auth_provider": "email",
                            "groups": [],
                            "user_permissions": []
                        },
                        "specialty": "saba",
                        sub_specialty: "",
                        addresses: []
                    }
    ]
  });

  const id = await Home();
  expect(id).toEqual("15");
});
