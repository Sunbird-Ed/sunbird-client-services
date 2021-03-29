import {CsContentsGroupGenerator} from './';
import {
    searchResult,
    searchResultWithMultiValueAttributes,
    searchResultWithNullAttributes,
    searchResultWithMultiValueSearchableAttributes
} from './cs-contents-group-generator.spec.data';
import {CsSortOrder} from '../../interface';

describe('ContentGroupGenerator', () => {
    it('should be able to generate contents grouped by its attributes', () => {
        // assert
        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResult.result.content as any,
                groupBy: 'subject',
                sortCriteria: {
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                },
                filterCriteria: [],
                combination: {
                    medium: ['invalid_medium', 'english', 'hindi'],
                    gradeLevel: ['class 2', 'invalid']
                },
            })
        ).toMatchSnapshot();

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResult.result.content as any,
                groupBy: 'subject',
                sortCriteria: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.ASC,
                }],
                filterCriteria: [],
                combination: {
                    medium: ['invalid_medium', 'english', 'hindi'],
                    gradeLevel: ['class 2', 'invalid']
                },
            })
        ).toEqual({
            name: 'subject',
            combination: {
                'medium': 'english'
            },
            sections: [
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array)
                }
            ]
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithMultiValueAttributes.result.content as any,
                groupBy: 'subject',
                sortCriteria: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterCriteria: []
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                }
            ]
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithNullAttributes.result.content as any,
                groupBy: 'subject',
                sortCriteria: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterCriteria: [],
                combination: {
                    medium: ['', 'invalid_medium', 'english', 'hindi'],
                    gradeLevel: [''],
                    invalidAttribute: undefined
                } as any,
            })
        ).toEqual({
            name: 'subject',
            combination: {
                'medium': ''
            },
            sections: expect.any(Array)
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithMultiValueAttributes.result.content as any,
                groupBy: 'subject',
                sortCriteria: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterCriteria: [{
                    filterAttribute: 'variants.online.size',
                    filterCondition: {
                        operation: '!=',
                        value: 3045
                    }
                }]
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                // {
                //     count: 1,
                //     name: 'Physical Science',
                //     contents: expect.any(Array)
                // },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                }
            ]
        });

        expect(
            CsContentsGroupGenerator.generate({
                contents: searchResultWithMultiValueSearchableAttributes.result.content as any,
                groupBy: 'subject',
                sortCriteria: [{
                    sortAttribute: 'name',
                    sortOrder: CsSortOrder.DESC,
                }],
                filterCriteria: [],
                includeSearchable: true
            })
        ).toEqual({
            name: 'subject',
            combination: undefined,
            sections: [
                {
                    count: 1,
                    name: 'Physical Science',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'NewSubject',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'Geography',
                    contents: expect.any(Array)
                },
                {
                    count: 1,
                    name: 'English',
                    contents: expect.any(Array)
                }
            ]
        });
    });
});
