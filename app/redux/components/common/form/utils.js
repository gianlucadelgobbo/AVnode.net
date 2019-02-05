/* eslint no-loop-func: 0, no-console: 0 */

export function generateData(x = 3, y = 2, z = 1, gData = []) {
  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    const preKey = _preKey || "0";
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({
        title: `${key}-label`,
        value: `${key}-value`,
        key,
        disabled: key === "0-0-0-1" || false
      });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const __level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });

    return null;
  }
  _loop(z);
  return gData;
}
export function calcTotal(x = 3, y = 2, z = 1) {
  /* eslint no-param-reassign:0 */
  const rec = n => (n >= 0 ? x * y ** n-- + rec(n) : 0);
  return rec(z + 1);
}

export const gData = generateData();

export function generateTreeNodes(treeNode) {
  const arr = [];
  const key = treeNode.props.eventKey;
  for (let i = 0; i < 3; i++) {
    arr.push({
      title: `${key}-${i}-label`,
      value: `${key}-${i}-value`,
      key: `${key}-${i}`
    });
  }
  return arr;
}

function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1;
    data.forEach(item => {
      if (
        item.key.length > curKey.length
          ? item.key.indexOf(curKey) !== 0
          : curKey.indexOf(item.key) !== 0
      ) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

export function getNewTreeData(treeData, curKey, child, level) {
  const loop = data => {
    if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach(item => {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

function loopData(data, callback) {
  const loop = (d, level = 0) => {
    d.forEach((item, index) => {
      const pos = `${level}-${index}`;
      if (item.children) {
        loop(item.children, pos);
      }
      callback(item, index, pos);
    });
  };
  loop(data);
}

function isPositionPrefix(smallPos, bigPos) {
  if (bigPos.length < smallPos.length) {
    return false;
  }
  // attention: "0-0-1" "0-0-10"
  if (
    bigPos.length > smallPos.length &&
    bigPos.charAt(smallPos.length) !== "-"
  ) {
    return false;
  }
  return bigPos.substr(0, smallPos.length) === smallPos;
}

export function getFilterValue(val, sVal, delVal) {
  const allPos = [];
  const delPos = [];
  loopData(gData, (item, index, pos) => {
    if (sVal.indexOf(item.value) > -1) {
      allPos.push(pos);
    }
    if (delVal.indexOf(item.value) > -1) {
      delPos.push(pos);
    }
  });
  const newPos = [];
  delPos.forEach(item => {
    allPos.forEach(i => {
      if (isPositionPrefix(item, i) || isPositionPrefix(i, item)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newPos.push(i);
    });
  });
  const newVal = [];
  if (newPos.length) {
    loopData(gData, (item, index, pos) => {
      if (newPos.indexOf(pos) > -1) {
        newVal.push(item.value);
      }
    });
  }
  return newVal;
}


// Convert tech_arts format for FieldArray redux-form
    /*v.tech_arts = [];
        if (Array.isArray(model.tech_arts)) {

            // convert current lang
            v.tech_arts = model.tech_arts.map(x => ({
                key: `tech_arts.${x.lang}`,
                value: x.text
            }));
        }

        locales.forEach(l => {
            let found = v.tech_arts.filter(o => o.key === `tech_arts.${l}`).length > 0;
            if (!found) {
                v.tech_arts.push({
                    key: `tech_arts.${l}`,
                    value: ""
                })
            }
        });
        v.tech_reqs = [];
        if (Array.isArray(model.tech_reqs)) {

            // convert current lang
            v.tech_reqs = model.tech_reqs.map(x => ({
                key: `tech_reqs.it`,
                value: x
            }));
        }

        locales.forEach(l => {
            let found = v.tech_reqs.filter(o => o.key === `tech_reqs.${l}`).length > 0;
            if (!found) {
                v.tech_reqs.push({
                    key: `tech_reqs.${l}`,
                    value: ""
                })
            }
        });
        */


    /*

     <select onChange={onChangeSelect}>
        {categories.map((category) => (
          <option key={category.key} value={category.value}>
            {category.title}
          </option>
        ))}
        </select>


      const getMajorMethod2 = () => {
      const view = categories.filter((item) => item.value === selectedRadio);
      return view.length === 0 ? (
        ""
      ) : (
        <div>
          {view[0].children.length>0 &&
          <select>
            {view[0].children.map((t) => <option key={t.key} value={t.value}>{t.title}</option>)}
          </select>
          }
        </div>
      );
    }

    const getChildrenCategories2 = () => {
      const genres = categorySelected.length>0?categorySelected[0].children:"";
      return genres.length === 0 ? (
        ""
        ) : (
        <div>
          {genres[0].children.length>0 &&
            <select>
              {genres[0].children.map((t) => <option key={t.key} value={t.value}>{t.title}</option>)}
            </select>
          }
        </div>
      );
    }
         
  */