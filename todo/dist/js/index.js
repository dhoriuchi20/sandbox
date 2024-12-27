((win, doc) => {
  "use strict";

  class Todo {
    constructor() {
      this.classNames = {
        inputText: "js-todoList-inputText",
        inputPriority: "js-todoList-inputPriority",
        inputDeadline: "js-todoList-inputDeadline",
        inputSubmit: "js-todoList-inputSubmit",
        deleteButton: "js-todoList-deleteButton",
        itemContainer: "js-todoList-container",
        item: "js-todoList-item",
        sortPriorityButton: "js-sortOrder-priorityButton",
        sortDeadlineButton: "js-sortOrder-deadlineButton"
      };
      this.elements = {
        inputText: doc.querySelector(`.${this.classNames.inputText}`),
        inputPriority: doc.querySelector(`.${this.classNames.inputPriority}`),
        inputDeadline: doc.querySelector(`.${this.classNames.inputDeadline}`),
        inputSubmit: doc.querySelector(`.${this.classNames.inputSubmit}`),
        itemContainer: doc.querySelector(`.${this.classNames.itemContainer}`),
        sortPriorityButton: doc.querySelector(`.${this.classNames.sortPriorityButton}`),
        sortDeadlineButton: doc.querySelector(`.${this.classNames.sortDeadlineButton}`),
        deleteButtons: null
      };
      this.config = {
        rows: [],
        deadlineSortFlag: true,
        prioritySortFlag: true
      };
    }
    init() {
      if (!this.elements.inputText || !this.elements.inputPriority || !this.elements.inputDeadline || !this.elements.inputSubmit) {
        return;
      }
      this.setToday();
      this.changePriority();
      this.setClickEvent();
    }
    setToday() {
      const today = new Date();
      today.setDate(today.getDate());
      const year = today.getFullYear();
      const month = ("0" + (today.getMonth() + 1)).slice(-2);
      const day = ("0" + today.getDate()).slice(-2);
      this.elements.inputDeadline.value = `${year}-${month}-${day}`;
    }
    changePriority() {
      this.elements.inputPriority.addEventListener('change', e => {
        const priority = e.currentTarget.value;
        switch (priority) {
          case 'high':
            e.currentTarget.dataset.priority = '1';
            break;
          case 'medium':
            e.currentTarget.dataset.priority = '2';
            break;
          case 'low':
            e.currentTarget.dataset.priority = '3';
            break;
          default:
            e.currentTarget.dataset.priority = '1';
        }
      });
    }
    setClickEvent() {
      this.elements.inputSubmit.addEventListener('click', this.clickInputSubmit.bind(this));
      this.elements.sortPriorityButton.addEventListener('click', this.clickSortPriorityButton.bind(this));
      this.elements.sortDeadlineButton.addEventListener('click', this.clickSortDeadlineButton.bind(this));
    }
    clickInputSubmit() {
      const textInput = this.elements.inputText.value.trim();
      const priority = this.elements.inputPriority.value;
      const deadline = this.elements.inputDeadline.value;
      const items = this.elements.itemContainer.querySelectorAll(`.${this.classNames.item}`);
      const sortPriority = this.elements.inputPriority.dataset.priority;
      const newRow = {
        textInput,
        priority,
        deadline,
        sortPriority
      };
      if (!textInput || !deadline) {
        return;
      }
      this.config.rows = Array.from(items).map(row => {
        return {
          textInput: row.cells[1].textContent,
          priority: row.cells[2].textContent,
          deadline: row.cells[3].textContent,
          sortPriority: row.cells[2].dataset.sortpriority
        };
      });
      this.config.rows.push(newRow);
      this.orderAscending(this.config.rows, 'sortPriority');
      this.orderAscending(this.config.rows, 'deadline');
      this.createRows(this.config.rows);
      this.resetDefaultSetting();
    }
    orderAscending(array, type) {
      array.sort((a, b) => new Date(a[type]) - new Date(b[type]));
    }
    orderDescending(array, type) {
      array.sort((a, b) => new Date(b[type]) - new Date(a[type]));
    }
    clickSortPriorityButton() {
      if (this.config.prioritySortFlag) {
        this.orderDescending(this.config.rows, 'sortPriority');
        this.createRows();
        this.config.prioritySortFlag = false;
      } else {
        this.orderAscending(this.config.rows, 'sortPriority');
        this.createRows();
        this.config.prioritySortFlag = true;
      }
    }
    clickSortDeadlineButton() {
      if (this.config.deadlineSortFlag) {
        this.orderDescending(this.config.rows, 'deadline');
        this.createRows();
        this.config.deadlineSortFlag = false;
      } else {
        this.orderAscending(this.config.rows, 'deadline');
        this.createRows();
        this.config.deadlineSortFlag = true;
      }
    }
    clickDeleteButton(e) {
      const button = e.currentTarget;
      if (button.checked) {
        button.closest(`.${this.classNames.item}`).remove();
      }
    }
    createRows() {
      this.elements.itemContainer.innerHTML = "";
      this.config.rows.forEach(row => {
        const tr = doc.createElement('tr');
        tr.classList.add(this.classNames.item);
        tr.innerHTML = `<td class="cell"><label><input type="checkbox" name="delete" class="js-todoList-deleteButton"><span>削除</span></label></td>
                            <td class="cell">${row.textInput}</td>
                            <td class="cell" data-sortpriority="${row.sortPriority}">${row.priority}</td>
                            <td class="cell">${row.deadline}</td>`;
        this.elements.itemContainer.appendChild(tr);
      });
      this.setClickDeleteEvent();
    }
    resetDefaultSetting() {
      this.elements.inputText.value = "";
      this.elements.inputPriority[0].selected = true;
      this.elements.inputPriority.dataset.priority = '1';
      this.setToday();
    }
  }
  win.addEventListener("DOMContentLoaded", () => {
    const todo = new Todo();
    todo.init();
  });
})(window, window.document);