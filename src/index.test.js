const request = require('supertest');
const app = require('./index');
const assert = require('chai').assert;

describe('/businesses endpoint', function () {
    it('accepts `page` and `limit` query string parameters for pagination', () => {
        const page = 2;
        const limit = 10;

        return request(app)
            .get(`/businesses?page=${page}&limit=${limit}`)
            .expect(200)
            .then((res) => {
                assert.isNumber(res.body.pagination.total);
                assert.lengthOf(res.body.businesses, 10);
                assert.strictEqual(res.body.businesses[0].id, 10);
            });
    });

    it('sorts by business id in ascending order', () => {
        return request(app)
            .get('/businesses')
            .expect(200)
            .then((res) => {
                assert.lengthOf(res.body.businesses, 50);

                var prevId;
                res.body.businesses.forEach((business) => {
                    assert.isNumber(business.id);
                    if (prevId !== undefined) {
                        assert.isAbove(business.id, prevId);
                    }
                    prevId = business.id;
                });
            });
    });

    it('defaults to 50 results per page', () => {
        return request(app)
            .get('/businesses')
            .expect(200)
            .then((res) => {
                assert.lengthOf(res.body.businesses, 50);
            });
    });

    [
        '?page=notNumber',
        '?limit=notNumber',
        '?page=-1',
        '?limit=-1'
    ].forEach((queryString) => {
        it(`returns a 400 if query params are invalid => ${queryString}`, () => {
            return request(app)
                .get(`/businesses${queryString}`)
                .expect(400)
                .then((res) => {
                    assert.property(res.body, 'message');
                });
        });
    });
});

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
