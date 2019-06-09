export default function getNeedInjectViewComponentsMap (fields, keys) {
    return keys.reduce((obj, field) => {
        const view = fields[field].view;
        if (view && view.component) {
            obj[field] = view;
        }
        return obj;
    }, {});
}
