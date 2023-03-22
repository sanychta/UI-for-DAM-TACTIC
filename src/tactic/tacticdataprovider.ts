/* eslint-disable @typescript-eslint/no-redeclare */
import {
    DataProvider,
    CrudFilters,
 } from "@pankod/refine-core";
// import { TacticServerStub } from "./api/tactic";

import TACTIC from './Tactic';

// Converts the CrudFilters type to an array of dictionaries for passing to dataProvider
const generateFilter = (filters?: CrudFilters) => {
        
    var out = [{}];
    out.pop();
    var tmp = {};

    if (filters) {
        filters.map((filter) => {
            if (filter.operator !== "or") {
                if (
                    filter.operator === "eq" ||
                    filter.operator === "contains" ||
                    filter.operator === "ne" ||
                    filter.operator === "lt" ||
                    filter.operator === "gt" ||
                    filter.operator === "lte" ||
                    filter.operator === "gte" ||
                    filter.operator === "in" ||
                    filter.operator === "nin" ||
                    filter.operator === "ncontains" ||
                    filter.operator === "containss" ||
                    filter.operator === "ncontainss" ||
                    filter.operator === "between" ||
                    filter.operator === "nbetween" ||
                    filter.operator === "null" ||
                    filter.operator === "nnull" ||
                    filter.operator === "startswith" ||
                    filter.operator === "nstartswith" ||
                    filter.operator === "startswiths" ||
                    filter.operator === "nstartswiths" ||
                    filter.operator === "endswith" ||
                    filter.operator === "nendswith" ||
                    filter.operator === "endswiths" ||
                    filter.operator === "nendswiths"
                ) {
                    const { field, operator, value } = filter;
                    tmp = { field: field, operator: operator, value: value };
                    out.push(tmp);
                }
            }
            return out;
        });
    }
    return out;
};

const TacticDataProvider = (): DataProvider => ({
    // Function for creating a record in the database
    create: async ({ resource, variables }) => {
        // A temporary measure to create an Asset. Must be deleted after finding the correct option
        var x = Object(variables);
        if (x.assets_category) {
            x.assets_category_code = x.assets_category.code;
            delete x.assets_category;
        }

        const kwargs = {
            resource: resource, // table synonym in the database
            args: x, // a list of fields and their values to create a record in the database
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.CreateQuery", kwargs],
            null
        );

        return { data: data.info.data };
    },

    // Create multiple entries, optional
    createMany: async ({ resource, variables, metaData }) => {
        const kwargs = {
            resource: resource,
            variables: variables,
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.CreateManyQuery", kwargs],
            null
        );

        return { data: data.info.data };
    },

    // record deletion
    deleteOne: async ({ resource, id, variables, metaData }) => {
        const kwargs = {
            resource: resource, // table synonym in the database
            id: id, // record ID
            variables: variables, // additional deletion options
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.DeleteOneQuery", kwargs],
            null
        );

        return { data: data.info.data };
    },

    // deleting multiple entries
    deleteMany: async ({ resource, ids, variables, metaData }) => {
        const kwargs = {
            resource: resource, // table synonym in the database
            ids: ids, // list of record IDs
            variables: variables, // additional deletion options
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.DeleteManyQuery", kwargs],
            null
        );

        return { data: data.info.data };
    },

    getList: async ({
        resource,
        pagination = { current: 1, pageSize: 10 },
        hasPagination = true,
        sort = [],
        filters,
    }) => {
        if (hasPagination) {
            var { current: offset = 1, pageSize: limit = 10 } =
                pagination ?? {};
            offset = (offset - 1) * limit;
        } else {
            var offset = 0,
                limit = 0;
        }

        const fl = generateFilter(filters);

        var kwargs = {};

        if (sort.length > 0) {
            kwargs = {
                resource: resource,
                limit: limit,
                offset: offset,
                order_bys: {
                    order_bys: sort[0].field,
                    ord_direction: sort[0].order,
                },
                filters: fl,
            };
        } else {
            kwargs = {
                resource: resource,
                limit: limit,
                offset: offset,
                filters: fl,
            };
        }

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.GetListQuery", kwargs],
            null
        );

        return { data: data.info.data, total: data.info.total };
    },

    getMany: async ({ resource, ids }) => {
        const kwargs = {
            resource: resource,
            ids: ids,
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.GetManyQuery", kwargs],
            {}
        );
        return { data: data.info.data };
    },

    getOne: async ({ resource, id }) => {
        var args: any = [];

        var kwargs = {
            resource: resource,
            id: id,
        };

        args.push("refinejs.query_classes.GetOneQuery");
        args.push(kwargs);

        const data = await new TACTIC().request("execute_cmd", args, null);

        return { data: data.info.data };
    },

    update: async ({ resource, id, variables }) => {
        if (resource === "assets") {
            var x = Object(variables);
            x.assets_category_code = x.assets_category.code;
            delete x.assets_category;
        }

        const kwargs = {
            resource: resource,
            id: id,
            args: variables,
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.UpdateQuery", kwargs],
            null
        );

        return { data: data.info.data };
    },

    updateMany: async ({ resource, ids, variables, metaData }) => {
        const kwargs = {
            resource: resource,
            ids: ids,
            variables: variables,
        };

        const data = await new TACTIC().request(
            "execute_cmd",
            ["refinejs.query_classes.UpdateManyQuery", kwargs],
            null
        );

        return { data: data.info.data };
    },

    getApiUrl: () => {
        const apiUrl = String(new TACTIC().getCheckAuthEndpoint());
        return apiUrl;
    },
    // custom: async ({ url, method, filters, sort, payload, query, headers }) => {
    //     const data= ''

    //     return Promise.resolve({ data });
    // },
});

export default TacticDataProvider;

