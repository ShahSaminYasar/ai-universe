const aiCardsContainer = document.getElementById("ai_cards_container");
const showAllButton = document.getElementById("show_all_button");
const aiDetailsContainer = document.getElementById("ai_details");
const aiDetailsLoader = document.getElementById("details_loader");

const getAllData = async (all) => {
    toggleLoader(true);
    const response = await fetch('https://openapi.programming-hero.com/api/ai/tools');
    const data = await response.json();
    printData(data.data.tools, all);
}

function printData(datas, all) {
    aiCardsContainer.innerHTML = '';
    let slicedDatas = datas;
    if(!all) {
        slicedDatas = datas.slice(0, 9);
        if(datas.length > 9)
        {
            showAllButton.classList.remove("hidden");
        }
    } else {
        showAllButton.classList.add("hidden");
    };
    for(const data of slicedDatas) {
        const aiCardDiv = document.createElement("div");
        aiCardDiv.classList.add("ai_card", "p-3", "rounded-xl", "border-2", "border-slate-200", "flex", "flex-col", "gap-4", "justify-start");
        aiCardDiv.innerHTML = `
        <img src='${data.image}' alt="" class="ai_card_image w-full rounded-xl">
        <h3 class="text-black text-2xl font-semibold">Features</h3>
        <ol type="1" class="text-black">
            ${data.features.map(feature => {
                return `<li>${feature}</li>`
            }).join("")}
        </ol>
        <hr>
        <div class="flex flex-row justify-between align-middle">
            <div>
                <h2 class="text-black text-2xl font-semibold mb-2">${data.name}</h2>
                <p class="text-neutral-400 text-sm"><i class="fa-regular fa-calendar"></i> <span>${data.published_in}</span></p>
            </div>
            <div class="grid place-content-center">
                <button onclick='viewModal(${data.id})' class="text-red-400 text-lg p-3 rounded-full bg-red-100"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
        </div>
        `;
        aiCardsContainer.appendChild(aiCardDiv);
    }
    toggleLoader(false);
}

function toggleLoader(isLoading) {
    const loader = document.getElementById("loader");
    isLoading ? loader.classList.remove("hidden") : loader.classList.add("hidden");
}

function viewModal(id) {
    aiDetailsContainer.innerHTML = '';
    ai_details_modal.showModal();
    aiDetailsLoader.classList.remove("hidden");

    id < 10 ? id = '0' + id : id;

    console.log("Id : ", id);

    // Fetch Content
    fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`)
    .then(response => response.json())
    .then(data => callUpdate(data.data));


    function callUpdate(data) {    
        setTimeout(() => {
            updateDetailsContent(data);
        }, 800);
    }


    // Update Content
    function updateDetailsContent(data) {
            console.log("data: ", data);
        aiDetailsContainer.innerHTML = `
        <!-- Left Column -->
        <div class="bg-red-100 border-2 border-red-500 p-5 rounded-xl flex flex-col gap-5 fade-in">
            <p class="text-black font-semibold text-left text-xl">
                ${data.description}
            </p>
            <div class="grid grid-cols-3 gap-4 text-sm">
                ${
                    (()=>{
                        console.log(data.pricing);
                        return data.pricing != null ?
                            `<div class="bg-neutral-100 rounded-xl p-4 font-semibold text-green-600 text-center grid place-content-center">
                                ${data.pricing[0].price} ${data.pricing[0].plan}
                            </div>
                            <div class="bg-neutral-100 rounded-xl p-4 font-semibold text-orange-600 text-center grid place-content-center">
                                ${data.pricing[1].price} ${data.pricing[1].plan}
                            </div>
                            <div class="bg-neutral-100 rounded-xl p-4 font-semibold text-red-600 text-center grid place-content-center">
                                ${data.pricing[2].price} ${data.pricing[2].plan}
                            </div>`
                        : "Pricing: NULL";
                    })()
                }
            </div>
            <div class="flex flex-row gap-4 justify-between">
                <div>
                    <h4 class="text-black text-2xl font-semibold text-left mb-3">Features</h4>
                    <ul class="text-neutral-900">
                        ${
                            (() => {
                                const arrayOfFeatures = Object.values(data.features);
                                return arrayOfFeatures.map(feature => {
                                    return `<li>${feature.feature_name}</li>`
                                }).join("")
                            })()
                        }
                    </ul>
                </div>
                <div>
                    <h4 class="text-black text-2xl font-semibold text-left mb-3">Integrations</h4>
                    <ul class="text-neutral-900">
                        ${(() => {
                            if(data.integrations != null) {
                                return data.integrations.map(integration => {
                                    return `<li>${integration}</li>`
                                }).join("");
                            } else {
                                return "NO DATA";
                            }
                        })()}
                    </ul>
                </div>
            </div>
        </div>
        <!-- Right Column -->
        <di class="bg-white border-2 border-slate-200 p-5 rounded-xl flex flex-col justify-start gap-3 fade-in">
            <div class="ai_details_image_container">
                <img src="${data.image_link[0]}" class="rounded-xl" alt="">
                ${
                    (()=>{
                        if(data.accuracy.score != null) {
                            return `<div class="badge badge-secondary">${data.accuracy.score}% accuracy</div>`;
                        } else {
                            return '';
                        }
                    })()
                }
            </div>
            ${data.input_output_examples ? `<p class="text-xl font-semibold text-black text-center">${data.input_output_examples[0].input}</p>
            <p class="text-base text-neutral-900 text-center font-normal">${data.input_output_examples[0].output}</p>` : ''}
        </div>
        `;
        aiDetailsLoader.classList.add("hidden");
    }
}

getAllData(false);