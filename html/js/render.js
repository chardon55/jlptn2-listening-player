// let packageInfo

// $.ajax({
//     url: "../package.json",
//     async: false,
//     success: (data, textStatus, jqXHR) => {
//         packageInfo = data
//     }
// })

// function printVersion() {
//     $(".version-field").html(`&nbsp;&nbsp;Version: ${packageInfo.version}`)
// }

let meta = null
let player = null

let mainPanel = null

function refreshMainPanel(bookIdx, sectionIdx) {
    mainPanel.html("")

    // const listItem = $(`#list-item-${bookIdx}-${sectionIdx}`)
    const pathContainer = $(`#file-path-container-${bookIdx}-${sectionIdx}`)
    const currentBook = meta.books[bookIdx]
    const currentSection = currentBook.sections[sectionIdx]

    let files = []

    pathContainer.children('i').each((index, elem) => {
        files.push(elem.innerText)
    })

    mainPanel.append(`
<div class="card">
    <div class="card-body">
        <h1 class="text-center fs-2">${currentBook.name}</h1>
        <h2 class="text-center fs-3">${currentSection.name}&nbsp;&nbsp;${currentSection.description}</h2>
    </div>
</div>
<div class="file-control-group" id="file-control-group" style="overflow-y: scroll;">
</div>
            `)

    // const controlGroup = $("#file-control-group")
    const controlGroupDOM = document.getElementById('file-control-group')

    controlGroupDOM.innerHTML += "<div class=\"card card-body\"></div>"

    let offset = 0

    let audioIdx = 0

    for (let file of files) {
        if (file == "---") {
            controlGroupDOM.innerHTML += "<div class=\"card card-body\"></div>"
            offset++
            continue
        }

        controlGroupDOM.children[offset].innerHTML += `
<div class="py-3">
    <div class="badge bg-success">Audio&nbsp;${audioIdx + 1}</div>
    <div>
        <audio controls src="../audio/${currentBook.dir}/${file}" id="audio-control-${audioIdx}"></audio>
    </div>
</div>
                `

        audioIdx++
    }

    const audioCount = files.length
}

function changeActiveItem(activeId, parent) {
    $(parent).children('.list-group-item').each((index, el) => {
        el.classList.remove('active')
        $(el).attr("aria-current", false)
    })

    const target = $(activeId)
    target.addClass("active")
    target.attr("aria-current", true)
}

function loadUI(assignedMainPanel) {

    mainPanel = assignedMainPanel

    $.ajax({
        url: "../audio/meta.json",
        method: 'GET',
        async: true,
        success: (data, textStatus, jqXHR) => {
            const books = data.books
            const menu = $("#main-menu")

            meta = data

            for (let bookIdx in books) {
                menu.append(`
<div class="accordion-item" id="menu-item-book-${bookIdx}">
    <div class="accordion-header" id="menu-item-heading-${bookIdx}">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        ${books[bookIdx].name}
      </button>
    </div>
    <div id="menu-item-collapse-${bookIdx}" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body p-0">
        <i class="hidden-tag" id="menu-item-color-tag-${bookIdx}">${books[bookIdx].color}</i>
        <div class="" id="menu-item-list-group-${bookIdx}"></div>
      </div>
    </div>
</div>
                        `)

                const listGroup = $(`#menu-item-list-group-${bookIdx}`)

                let isFirst = true
                let sectionIdx = 0

                for (let section of books[bookIdx].sections) {
                    listGroup.append(`
<a class="list-group-item"
   id="list-item-${bookIdx}-${sectionIdx}"
   href="javascript:changeActiveItem('#list-item-${bookIdx}-${sectionIdx}', '#menu-item-list-group-${bookIdx}');refreshMainPanel(${bookIdx}, ${sectionIdx});">
    ${section.name}<br />${section.description}
    <div class="hidden-tag file-path-container" id="file-path-container-${bookIdx}-${sectionIdx}"></div>
</a>
                            `)

                    const pathContainer = $(`#file-path-container-${bookIdx}-${sectionIdx}`)

                    for (let file of section.files) {
                        pathContainer.append(`<i>${file}</i>`)
                    }

                    isFirst = false
                    sectionIdx++
                }
            }
        }
    })
}
