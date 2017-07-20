var model = {
    left: null,
    right: null,
    results: ko.observableArray([]),
    validate: function () {
        if (this.left && this.right) {
            this.results.removeAll();
            compare(this.left, this.right, '', this.results);
            console.log(this.results());
        }
    }
}

function convert(key, text) {
    model[key] = JSON.parse(text);
    model.validate();
}

function compare(left, right, path, res) {
    console.log('Comparing:', left, right);
    if (left == null && right != null) {
        res.push({ path: path, error: 'Left value is null' });
        return false;
    }
    else if (left != null && right == null) {
        res.push({ path: path, error: 'Right value is null' });
        return false;
    }
    var eq = true;
    var ltype = typeof (left), rtype = typeof (right);
    if (ltype != rtype) {
        res.push({ path: path, error: 'Type mismatch (' + ltype + ' != ' + rtype + ')' });
        eq = false;
    } else if (left.constructor != right.constructor) {
        res.push({ path: path, error: 'Type mismatch (' + left.constructor + ' != ' + right.constructor + ')' });
        eq = false;
    }
    else if (left.constructor === Array) {
        for (var i = 0; i < left.length; i++) {
            var index = right.findIndex(elem => compare(left[i], elem, path + '[' + i + ']', []));
            if (index < 0) {
                res.push({ path: path + '[' + i + ']', error: 'Object not in right array (' + JSON.stringify(left[i]) + ')' });
                eq = false;
            }
        }
        for (var i = 0; i < right.length; i++) {
            var index = left.findIndex(elem => compare(left[i], elem, path + '[' + i + ']', []));
            if (index < 0) {
                res.push({ path: path + '[' + i + ']', error: 'Object not in left array (' + JSON.stringify(right[i]) + ')' });
                eq = false;
            }
        }
    }
    else if (ltype == 'number' || ltype == 'string') {
        if (left !== right) {
            res.push({ path: path, error: 'Value mismatch (' + left + ' != ' + right + ')' });
            eq = false;
        }
    }
    else if (ltype == 'object') {
        for (var key in left) {
            if (right[key] === undefined) {
                res.push({ path: path, error: 'Right side is missing propery (' + key + ')' });
                eq = false;
            } else {
                eq = compare(left[key], right[key], path + '.' + key, res);
            }
        }
        for (var key in right) {
            if (left[key] === undefined) {
                res.push({ path: path, error: 'Left side is missing propery (' + key + ')' });
                eq = false;
            }
        }
    } else {
        res.push({ path: path, error: 'Unhandled type (' + ltype + ')' });
        eq = false;
    }
    return eq;
}

ko.applyBindings(model);
