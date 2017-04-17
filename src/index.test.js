const request = require('supertest');
const app = require('./index');
const assert = require('chai').assert;

describe('/businesses/{id} endpoint', () => {
    it('returns business model if business exists', () => {
        const businessModelProperties = [
            'id',
            'uuid',
            'name',
            'address',
            'address2',
            'city',
            'state',
            'zip',
            'country',
            'phone',
            'website',
            'created_at'
        ];
        const EXISTING_BUSINESS_ID = '1';

        return request(app)
            .get(`/businesses/${EXISTING_BUSINESS_ID}`)
            .expect(200)
            .then((res) => {
                assert.isObject(res.body);
                assert.sameMembers(businessModelProperties, Object.keys(res.body));
            });
    });

    it('returns 404 if business does not exist', () => {
        const NON_EXISTENT_BUSINESS_ID = '999999';

        return request(app)
            .get(`/businesses/${NON_EXISTENT_BUSINESS_ID}`)
            .expect(404)
            .then((res) => {
                assert.property(res.body, 'message');
            });
    });
});
