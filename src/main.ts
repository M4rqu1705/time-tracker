import './style.css'

const categories_datalist: HTMLDataListElement | null = document.getElementById("categories") as HTMLDataListElement | null;

const full_list: HTMLUListElement | null = document.getElementById("full-list") as HTMLUListElement | null;

const category_input: HTMLInputElement | null = document.getElementById("category-input") as HTMLInputElement | null;
const start_time_input: HTMLInputElement | null = document.getElementById("start-time-input") as HTMLInputElement | null;

const add_category: HTMLButtonElement | null = document.getElementById("add-category") as HTMLButtonElement | null;
const remove_category: HTMLButtonElement | null = document.getElementById("remove-category") as HTMLButtonElement | null;
const add_task: HTMLButtonElement | null = document.getElementById("add-task") as HTMLButtonElement | null;

const export_json: HTMLButtonElement | null = document.getElementById("export-json") as HTMLButtonElement | null;
const export_csv: HTMLButtonElement | null = document.getElementById("export-csv") as HTMLButtonElement | null;

const delete_all: HTMLButtonElement | null = document.getElementById("delete-all") as HTMLButtonElement | null;

const temporary_output: HTMLTextAreaElement | null = document.getElementById("temporary-output") as HTMLTextAreaElement | null;

const DEFAULT_CATEGORIES = [
  "Socializing",
  "Taking Classes",
  "Studying",
  "Transporting",
  "Eating",
  "Errands",
  "YouTube",
  "Other Distraction",
];

let categories: string[] = DEFAULT_CATEGORIES;

let tasks: Array<[{
  "year": number,
  "month": number,
  "day": number,
  "hour": number,
  "minute": number,
}, string]> = [];

function update_categories(): void {
  localStorage.setItem("categories", JSON.stringify(categories));

  if (!categories_datalist) return;
  categories.forEach((value: string) => {
    const option = document.createElement("option");
    option.innerHTML = value;
    categories_datalist.appendChild(option);
  });
}

function update_tasks(): void {
  if (!tasks) return;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  if (!full_list) return;
  full_list.innerHTML = "";

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  tasks.filter(value =>
    value[0].year === year && value[0].month === month && value[0].day === day
  ).sort((a, b) => {
    if (a[0].hour !== b[0].hour)
      return a[0].hour - b[0].hour;
    return a[0].minute - b[0].minute;
  }).forEach(value => {
    const row = document.createElement("tr");
    const hour = value[0].hour.toString().padStart(2, '0');
    const minute = value[0].minute.toString().padStart(2, '0');
    const category = value[1]

    row.innerHTML = `<td class="border-2">${hour}:${minute}</td><td class="border-2">${category}</td>`;

    const remove = document.createElement("button");
    remove.classList.add("w-8", "h-8", "bg-rose-700", "text-white", "font-bold", "rounded");
    remove.textContent = "-";
    remove.addEventListener("click", (event) => {
      event.preventDefault();
      if (!confirm("Do you really want to remove this task?"))
        return;

      const task_of_interest: [{
        "year": number,
        "month": number,
        "day": number,
        "hour": number,
        "minute": number,
      }, string] = [{ "year": year, "month": month, "day": day, "hour": value[0].hour, "minute": value[0].minute }, category];

      const idx = tasks.map(task => {
        for (let key of Object.keys(task[0]))
          if (task[0][key as keyof typeof task[0]] !== task_of_interest[0][key as keyof typeof task[0]])
            return false;
        return task[1] === task_of_interest[1]
      }).indexOf(true);

      tasks.splice(idx, 1);

      update_tasks();
    });
    row.appendChild(remove)

    full_list.appendChild(row);
  });
}


///////////////////////////////////////////////////////////////////////
////////////////////////// EVENT LISTENERS ////////////////////////////
///////////////////////////////////////////////////////////////////////

window?.addEventListener("load", () => {
  if (localStorage.getItem("categories") !== null)
    categories = JSON.parse(localStorage.getItem("categories") as string);

  if (localStorage.getItem("tasks") !== null)
    tasks = JSON.parse(localStorage.getItem("tasks") as string);

  update_categories();
  update_tasks();
});


add_category?.addEventListener("click", (ev: Event) => {
  ev.preventDefault();

  if (!category_input) {
    console.warn("Element with id `category-input` not found!");
    return;
  }

  const new_category = category_input.value.trim();

  if (categories.indexOf(new_category) !== -1)
    return;

  if (!confirm(`Do you really want to add "${new_category}" to the categories?`))
    return;

  categories.push(new_category);

  update_categories();
});


remove_category?.addEventListener("click", (ev: Event) => {
  ev.preventDefault();

  if (!category_input) {
    console.warn("Element with id `category-input` not found!");
    return;
  }

  const old_category = category_input.value.trim();
  const position = categories.indexOf(old_category);

  if (position === -1)
    return;

  if (!confirm(`Do you really want to remove "${old_category}" from the categories?`))
    return;

  categories.splice(position, 1);

  update_categories();
});


add_task?.addEventListener("click", (ev: Event) => {
  ev.preventDefault();

  const category = category_input?.value.trim() as string;
  if (categories.indexOf(category) === -1) {
    alert(`"${category}" is not a valid category. Add it before you use it.`)
    return;
  }

  const start_time = start_time_input?.value.trim() as string;
  if (start_time.length === 0) {
    alert(`Input the start time before adding the task.`)
    return;
  }

  const date = new Date();

  const [hour_string, minute_string] = start_time.split(":");
  const hour = +hour_string;
  const minute = +minute_string;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const new_task: [{
    "year": number,
    "month": number,
    "day": number,
    "hour": number,
    "minute": number,
  }, string] = [{ year, month, day, hour, minute }, category];

  if (tasks.every(task => {
    for (let key of Object.keys(task[0]))
      if (task[0][key as keyof typeof task[0]] !== new_task[0][key as keyof typeof task[0]])
        return true;
    return task[1] !== new_task[1]
  }))
    tasks.push(new_task);

  update_tasks();
});


export_json?.addEventListener("click", (ev) => {
  ev.preventDefault();

  const data = JSON.stringify(tasks);

  if (!confirm("Copy the output to the clipboard?")) return;

  navigator.clipboard.writeText(data);

  if (temporary_output)
    temporary_output.textContent = data;
})


export_csv?.addEventListener("click", (ev) => {
  ev.preventDefault();

  let data = "Start Time,Category\n";

  tasks.forEach(value => {
    // yyyy-MM-dd HH:mm:ss
    const row = `${value[0].year.toString().padStart(4, '0')}-${value[0].month.toString().padStart(2, '0')}-${value[0].day.toString().padStart(2, '0')} ${value[0].hour.toString().padStart(2, '0')}:${value[0].minute.toString().padStart(2, '0')}:00,${value[1]}`
    data += row + "\n";
  })

  if (!confirm("Copy the output to the clipboard?")) return;

  navigator.clipboard.writeText(data);

  if (temporary_output)
    temporary_output.textContent = data;
})

delete_all?.addEventListener("click", (ev) => {
  ev.preventDefault();

  if (!confirm("Are you sure you want to delete ALL store tasks and categories?")) return;

  localStorage.removeItem("categories");
  localStorage.removeItem("tasks")

  categories = DEFAULT_CATEGORIES;
  tasks = [];

  update_categories();
  update_tasks();
})