function identity (value) {
    return value;
}

export default {
    name:'Views',
    functional: true,
    props: {
        view: {
            type: Object,
        },
        record: {
            type: Object,
            required: true,
        },
        field: {
            type: String,
            required: true,
        },
    },
    render (h, {
        props, scopedSlots, parent, 
    }) {
        let info = props.record[props.field];

        if (props.view) {
            const {
                config = {},
                join,
                component,
                handler,
                getViewValue = identity,
            } = props.view;

            const isJoinField = join && (typeof join === 'object');
            if (isJoinField) {
                const obj = props.record.hasOwnProperty(props.field) ? {
                    [props.field]: info, 
                } : {};
                if (Array.isArray(join)) {
                    info = join.reduce((obj, field) => {
                        obj[field] = props.record[field];
                        return obj;
                    }, obj);
                } else {
                    info = Object.keys(join).reduce((obj, originalField) => {
                        obj[join[originalField]] = props.record[originalField];
                        return obj;
                    }, obj);
                }
            }
            // parent 是为了绑定this指向 可能会访问$store或者原型对象上的属性
            info = getViewValue.call(parent,info);

            if (component) {
                const scopedSlotsData = isJoinField
                    ? {
                        ...info,
                        ...config,
                    }
                    : {
                        data: info,
                        ...config,
                    };
                return scopedSlots.default(scopedSlotsData);
            } else if (handler) {
                // parent 是为了绑定this指向 可能会访问$store或者原型对象上的属性
                return (
                    <span>
                        {handler.call(parent, info, config)}
                    </span>
                );
            }
        } else {
            return (
                <span>{info}</span>
            );
        }
    },
};
