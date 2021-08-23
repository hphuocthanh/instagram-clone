/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-plusplus */
export function seedDatabase(firebase) {
  const users = [
    {
      userId: 'ZcEeMFcyRXh5BpXVrpqlIuSuoG93',
      username: 'hphuocthanh',
      fullName: 'Thanh Hoang Phuoc',
      emailAddress: 'phuocthanhqt113@gmail.com',
      following: ['4'],
      followers: [],
      dateCreated: Date.now()
    },
    {
      userId: '2',
      username: 'chanh308',
      fullName: 'Chau Anh',
      emailAddress: 'chauanh308@gnmail.com',
      following: [],
      followers: ['ZcEeMFcyRXh5BpXVrpqlIuSuoG93'],
      dateCreated: Date.now()
    },
    {
      userId: '3',
      username: 'bink',
      fullName: 'Black Ink',
      emailAddress: 'ink@gmail.com',
      following: [],
      followers: ['ZcEeMFcyRXh5BpXVrpqlIuSuoG93'],
      dateCreated: Date.now()
    },
    {
      userId: '4',
      username: 'ldwook',
      fullName: 'Lee Dong Wook',
      emailAddress: 'leedwook@idol.com',
      following: [],
      followers: ['ZcEeMFcyRXh5BpXVrpqlIuSuoG93'],
      dateCreated: Date.now()
    }
  ];

  // eslint-disable-next-line prefer-const
  for (let k = 0; k < users.length; k++) {
    firebase.firestore().collection('users').add(users[k]);
  }

  // eslint-disable-next-line prefer-const
  for (let i = 1; i <= 5; ++i) {
    firebase
      .firestore()
      .collection('photos')
      .add({
        photoId: i,
        userId: '4',
        imageSrc: `/images/users/ldwook/${i}.jpg`,
        caption: 'Korea Aesthetic',
        likes: [],
        comments: [
          {
            displayName: 'bink',
            comment: 'Love this place, looks like my next home!'
          },
          {
            displayName: 'hphuocthanh',
            comment: 'Would you mind if I used this picture?'
          }
        ],
        userLatitude: '40.7128°',
        userLongitude: '74.0060°',
        dateCreated: Date.now()
      });
  }
}
