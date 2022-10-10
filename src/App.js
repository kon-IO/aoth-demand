import React from "react";
import {
  format,
  abs,
  fraction as frac,
  subtract as sub,
  add,
  multiply as mul,
  divide as div,
} from "mathjs";
import "./App.css";

export default function Index() {
  return (
    <div class="h-screen">
      <div className="min-h-full w-full flex justify-center items-center">
        <Table />
      </div>
    </div>
  );
}

function fmt(frc) {
  const formatted = format(frc);
  if (frc.d === 1) return frc.toString();
  return formatted;
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        [frac(40), frac(50), frac(-1, 12)],
        [frac(10), frac(40), frac(-12, 5)],
      ],
    };
  }

  removeInd(ind) {
    const arr = this.state.data.slice();
    arr.splice(ind, 1);
    this.calcEDs(arr);
  }

  findED(q1, p1, q2, p2) {
    return mul(div(sub(q1, q2), sub(p2, p1)), div(p1, p2));
  }

  calcEDs(nArr = null) {
    let newArr;
    if (nArr === null) {
      newArr = this.state.data.slice();
    } else {
      newArr = nArr;
    }
    if (newArr.length === 1) {
      newArr[0][2] = NaN;
    } else {
      newArr.slice().forEach((val, ind) => {
        if (ind === newArr.length - 1) {
          newArr[ind][2] = this.findED(
            val[0],
            newArr[ind - 1][0],
            val[1],
            newArr[ind - 1][1]
          );
          return;
        }
        newArr[ind][2] = this.findED(
          val[0],
          newArr[ind + 1][0],
          val[1],
          newArr[ind + 1][1]
        );
      });
    }

    this.setState({
      data: newArr,
    });
  }

  addRow() {
    const arr = this.state.data.slice();
    if (arr.length === 0) {
      arr.push([frac(1), frac(2)]);
    } else {
      const firstLast = arr.length - 1;
      arr.push([add(arr[firstLast][0], 1), add(arr[firstLast][1], 1)]);
    }
    this.calcEDs(arr);
  }

  onEditableBlur(ind, event, isX) {
    const arr = this.state.data.slice();
    arr[ind][isX ? 0 : 1] = frac(event.target.innerText.replaceAll(/\s/g, ""));
    this.setState({
      data: arr,
    });
    this.calcEDs();
  }

  render() {
    const len = this.state.data.length;
    const arr = this.state.data.map((el, ind) => {
      let ch = ind % 24;
      ch = ch + 913 < 930 ? ch + 913 : ch + 914;
      return (
        <React.Fragment key={ind}>
          <tr>
            <td>{String.fromCharCode(ch)}</td>
            <td>
              <EditableTd
                onBlur={(i, e, x) => this.onEditableBlur(i, e, x)}
                number={fmt(el[0])}
                ind={ind}
                isX={true}
              />
            </td>
            <td>
              <EditableTd
                onBlur={(i, e, x) => this.onEditableBlur(i, e, x)}
                number={fmt(el[1])}
                ind={ind}
                isX={false}
              />
            </td>
            <td>{fmt(el[2])}</td>
            <td>
              <RemoveRowButton removeCb={() => this.removeInd(ind)} />
            </td>
          </tr>
          {/* {ind === len - 1 ? (
            ""
          ) : (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>{fmt(el[2])}</td>
              <td>{fmt(el[3])}</td>
            </tr>
          )} */}
        </React.Fragment>
      );
    });

    return (
      <div className="my-8 flex flex-col gap-6 justify-center items-center w-full">
        <table className="table">
          <TabelHead />
          <tbody>{arr}</tbody>
        </table>
        <button
          type="button"
          className="plusButton mb-4"
          aria-label="Add row"
          onClick={() => this.addRow()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
              fill="white"
            ></path>
          </svg>
        </button>
      </div>
    );
  }
}

function TabelHead() {
  return (
    <thead>
      <tr>
        <th>Συνδυασμοί</th>
        <th>
          Q<sub>D</sub>
        </th>
        <th>P</th>
        <th>
          E<sub>D</sub>
        </th>
        <th>Αφαίρεση</th>
      </tr>
    </thead>
  );
}

function EditableTd({ number, onBlur, ind, isX }) {
  // const debouncer = debounce((e) => {
  //   onBlur(ind, e, isX);
  // });
  return (
    <div
      contentEditable="true"
      onBlur={(e) => onBlur(ind, e, isX)}
      onKeyDown={(e) => {
        // debouncer(e);
        if (e.key === "Enter") {
          // Prevent newline from being typed
          e.preventDefault();
          // Make editable span lose focus
          e.target.blur();
        }
      }}
    >
      {number}
    </div>
  );
}

function RemoveRowButton({ removeCb }) {
  return (
    <button aria-label="Remove" onClick={() => removeCb()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
      </svg>
    </button>
  );
}
