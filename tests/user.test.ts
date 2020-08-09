const request=require('supertest')
import {app} from '../src/app'



test('main test',async()=>{
   const response= await request(app).post('/users').send({
        name:'Jean-Paul Rustom',
        password:'passwrdvofjeanpaul',
        email:'anpal@mail.com'
    }).expect(201)
    console.log(response.body)
})

