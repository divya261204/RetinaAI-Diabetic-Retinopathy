<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>RetinaAI - Diabetic Retinopathy Screening</title>

<style>

*{
    box-sizing:border-box;
}

body{
    margin:0;
    font-family:Segoe UI,Arial,sans-serif;
    background:
        radial-gradient(circle at 80% 0%,#315cff25,transparent 35%),
        linear-gradient(135deg,#06101d,#091827 60%,#071321);
    color:#f4f8ff;
}

button,
input{
    font:inherit;
}

a{
    text-decoration:none;
    color:inherit;
}


/* ================= SIDEBAR ================= */

.sidebar{
    position:fixed;
    left:0;
    top:0;
    bottom:0;
    width:250px;
    background:#071522f2;
    border-right:1px solid #1c3954;
    padding:24px 16px;
    z-index:10;
}

.brand{
    display:flex;
    align-items:center;
    gap:11px;
    padding:3px 8px 30px;
}

.logo{
    width:44px;
    height:44px;
    border-radius:14px;
    background:linear-gradient(135deg,#35d8ff,#6677ff);
    display:grid;
    place-items:center;
    font-size:22px;
}

.brand b{
    font-size:21px;
}

.brand b span{
    color:#35d8ff;
}

.brand small{
    display:block;
    color:#70869e;
    font-size:10px;
    margin-top:2px;
}

.nav-title{
    font-size:10px;
    color:#627991;
    letter-spacing:1.4px;
    margin:12px 10px 8px;
    text-transform:uppercase;
}

.nav a{
    display:flex;
    align-items:center;
    gap:12px;
    padding:12px 13px;
    border-radius:11px;
    color:#98aec3;
    font-size:13px;
    margin:4px 0;
}

.nav a:hover,
.nav a.active{
    background:#12304b;
    color:#fff;
}

.nav .ico{
    width:20px;
    text-align:center;
}

.side-note{
    position:absolute;
    bottom:20px;
    left:23px;
    right:20px;
    color:#647990;
    font-size:10px;
    line-height:1.65;
}


/* ================= MAIN ================= */

.main{
    margin-left:250px;
    padding:28px 34px;
    max-width:1550px;
}

.page{
    display:none;
}

.page.active{
    display:block;
}

.top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:25px;
}

.eyebrow{
    font-size:10px;
    letter-spacing:1.8px;
    color:#35d8ff;
    text-transform:uppercase;
}

.top h1{
    font-size:30px;
    margin:6px 0;
}

.sub{
    color:#8fa5bb;
    font-size:13px;
}

.status{
    padding:9px 13px;
    border:1px solid #205c4f;
    background:#09251f;
    border-radius:30px;
    color:#5be5bc;
    font-size:11px;
    font-weight:700;
}

.dot{
    display:inline-block;
    width:7px;
    height:7px;
    border-radius:50%;
    background:#36dfae;
    margin-right:7px;
}


/* ================= CARDS ================= */

.card{
    background:linear-gradient(145deg,#0d2033f5,#091827f5);
    border:1px solid #1c3954;
    border-radius:18px;
    box-shadow:0 18px 45px #0005;
}

.grid{
    display:grid;
    gap:17px;
}

.g4{
    grid-template-columns:repeat(4,1fr);
}

.g3{
    grid-template-columns:repeat(3,1fr);
}

.g2{
    grid-template-columns:repeat(2,1fr);
}

.stat{
    padding:20px;
}

.stat .k{
    font-size:10px;
    color:#71879e;
    text-transform:uppercase;
    letter-spacing:1px;
}

.stat .v{
    font-size:24px;
    font-weight:800;
    margin-top:8px;
}

.stat .s{
    font-size:10px;
    color:#56d9b2;
    margin-top:5px;
}


/* ================= HERO ================= */

.hero{
    padding:27px;
    display:grid;
    grid-template-columns:1.25fr .75fr;
    gap:25px;
    margin-bottom:18px;
}

.hero h2{
    font-size:25px;
    margin:3px 0 10px;
}

.hero p{
    color:#8fa5bb;
    line-height:1.7;
    font-size:13px;
}

.chips{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-top:17px;
}

.chip{
    padding:7px 10px;
    border-radius:20px;
    border:1px solid #254762;
    background:#102a42;
    color:#b7d5e9;
    font-size:10px;
}

.quick{
    padding:20px;
}

.quick h3{
    margin:0 0 12px;
}

.row{
    display:flex;
    justify-content:space-between;
    padding:11px 0;
    border-bottom:1px solid #1b3045;
    font-size:11px;
    color:#8fa5bb;
}

.row:last-child{
    border:0;
}

.row b{
    color:#fff;
}


/* ================= SECTIONS ================= */

.section{
    padding:23px;
    margin-bottom:17px;
}

.section h2{
    font-size:19px;
    margin:0 0 5px;
}

.desc{
    color:#8fa5bb;
    font-size:11px;
    margin-bottom:18px;
}


/* ================= BUTTONS ================= */

.primary{
    display:inline-block;
    border:0;
    border-radius:10px;
    padding:12px 18px;
    background:linear-gradient(135deg,#35d8ff,#6677ff);
    color:white;
    font-size:12px;
    font-weight:800;
    cursor:pointer;
}

.primary.green{
    background:linear-gradient(135deg,#18c996,#159f99);
    width:100%;
    margin-top:13px;
}

.choose{
    display:inline-block;
    border:0;
    border-radius:10px;
    padding:12px 18px;
    background:linear-gradient(135deg,#35d8ff,#6677ff);
    color:white;
    font-size:12px;
    font-weight:800;
    cursor:pointer;
}


/* ================= SCREENING ================= */

.upload-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:17px;
}

.drop{
    min-height:300px;
    border:2px dashed #2c5978;
    border-radius:17px;
    background:#081828;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:22px;
}

.drop:hover{
    border-color:#35d8ff;
}

.eye{
    font-size:45px;
    margin-bottom:12px;
}

.drop h3{
    margin:0 0 7px;
}

.drop p{
    color:#8fa5bb;
    font-size:11px;
    max-width:350px;
    line-height:1.6;
}

.file-name{
    color:#35d8ff;
    font-size:10px;
    margin-top:10px;
    min-height:14px;
}

.preview{
    min-height:300px;
    background:#07121f;
    border:1px solid #1c3954;
    border-radius:17px;
    display:flex;
    align-items:center;
    justify-content:center;
    position:relative;
    overflow:hidden;
}

.preview img{
    display:none;
    max-width:100%;
    max-height:300px;
    object-fit:contain;
}

.placeholder{
    color:#60758a;
    font-size:11px;
}


/* ================= PIPELINE ================= */

.pipeline{
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:9px;
}

.step{
    padding:17px 12px;
    text-align:center;
    border:1px solid #264862;
    border-radius:13px;
    background:#0a1b2c;
}

.step strong{
    display:block;
    margin:7px 0 4px;
    font-size:11px;
}

.step span{
    font-size:9px;
    color:#8fa5bb;
}


/* ================= NOTICE ================= */

.notice{
    padding:14px;
    border:1px solid #534921;
    background:#211f12;
    color:#d9ce94;
    border-radius:12px;
    font-size:10px;
    line-height:1.6;
    margin-top:16px;
}


/* ================= FOOTER ================= */

.footer{
    text-align:center;
    color:#52687e;
    font-size:10px;
    padding:20px 0;
}


/* ================= MOBILE ================= */

@media(max-width:1050px){

    .g4{
        grid-template-columns:repeat(2,1fr);
    }

    .hero,
    .upload-grid{
        grid-template-columns:1fr;
    }

    .pipeline{
        grid-template-columns:repeat(2,1fr);
    }
}

@media(max-width:760px){

    .sidebar{
        position:relative;
        width:100%;
        height:auto;
    }

    .side-note{
        display:none;
    }

    .nav{
        display:flex;
        overflow:auto;
    }

    .nav a{
        white-space:nowrap;
    }

    .main{
        margin:0;
        padding:18px;
    }

    .g4,
    .g3,
    .g2{
        grid-template-columns:1fr;
    }

    .top{
        flex-direction:column;
        gap:12px;
    }
}

</style>

</head>


<body>


<!-- ================= SIDEBAR ================= -->

<aside class="sidebar">

    <div class="brand">

        <div class="logo">◉</div>

        <div>

            <b>Retina<span>AI</span></b>

            <small>
                Smart Retinal Screening
            </small>

        </div>

    </div>


    <div class="nav-title">
        Workspace
    </div>


    <nav class="nav">

        <a href="#dashboard"
           data-page="dashboard"
           class="active">

            <span class="ico">⌂</span>
            Dashboard

        </a>


        <a href="#screening"
           data-page="screening">

            <span class="ico">◉</span>
            Screening

        </a>


        <a href="#explanation"
           data-page="explanation">

            <span class="ico">✦</span>
            AI Explanation

        </a>


        <a href="#analytics"
           data-page="analytics">

            <span class="ico">▣</span>
            Analytics

        </a>


        <a href="#history"
           data-page="history">

            <span class="ico">◷</span>
            History

        </a>


        <a href="#about"
           data-page="about">

            <span class="ico">ⓘ</span>
            About Model

        </a>

    </nav>


    <div class="side-note">

        <b style="color:#a1b4c8">
            Research Prototype
        </b>

        <br>

        Lightweight CNN · 5-Class Classification · Grad-CAM

        <br><br>

        Local processing enabled

    </div>

</aside>


<!-- ================= MAIN ================= -->

<main class="main">


<!-- ================= DASHBOARD ================= -->

<section id="dashboard"
         class="page active">

    <div class="top">

        <div>

            <div class="eyebrow">
                AI Retinal Intelligence Platform
            </div>

            <h1>
                Screening Dashboard
            </h1>

            <div class="sub">
                Explainable diabetic-retinopathy screening research prototype.
            </div>

        </div>


        <div class="status">

            <span class="dot"></span>

            MODEL READY

        </div>

    </div>


    <div class="hero card">

        <div>

            <div class="eyebrow">
                Welcome to RetinaAI
            </div>

            <h2>
                From retinal image to explainable insight.
            </h2>

            <p>
                Upload a fundus photograph, run the lightweight CNN,
                and inspect a Grad-CAM visualization showing regions
                that influenced the model prediction.
            </p>


            <div class="chips">

                <span class="chip">
                    ⚡ Fine-tuned MobileNetV2
                </span>

                <span class="chip">
                    🧠 Explainable AI
                </span>

                <span class="chip">
                    🔒 Local Processing
                </span>

                <span class="chip">
                    🎯 5 Classes
                </span>

            </div>

        </div>


        <div class="quick">

            <h3>
                System Snapshot
            </h3>

            <div class="row">
                <span>Input</span>
                <b>224 × 224 RGB</b>
            </div>

            <div class="row">
                <span>Classes</span>
                <b>5 severity levels</b>
            </div>

            <div class="row">
                <span>Explanation</span>
                <b>Grad-CAM</b>
            </div>

            <div class="row">
                <span>Model</span>
                <b>Fine-tuned MobileNetV2</b>
            </div>

        </div>

    </div>


    <div class="grid g4">

        <div class="card stat">

            <div class="k">
                Test Accuracy
            </div>

            <div class="v">
                70.36%
            </div>

            <div class="s">
                Fixed test set
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Input Resolution
            </div>

            <div class="v">
                224×224
            </div>

            <div class="s">
                Standardized image
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Classes
            </div>

            <div class="v">
                05
            </div>

            <div class="s">
                DR severity categories
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Explainability
            </div>

            <div class="v">
                Grad-CAM
            </div>

            <div class="s">
                Enabled
            </div>

        </div>

    </div>


    <div class="card section"
         style="margin-top:17px">

        <h2>
            Quick Start
        </h2>

        <div class="desc">
            Complete a screening in five steps.
        </div>


        <div class="pipeline">

            <div class="step">
                ①
                <strong>Upload</strong>
                <span>Choose fundus image</span>
            </div>

            <div class="step">
                ②
                <strong>Preprocess</strong>
                <span>Resize & normalize</span>
            </div>

            <div class="step">
                ③
                <strong>Classify</strong>
                <span>5-class model</span>
            </div>

            <div class="step">
                ④
                <strong>Explain</strong>
                <span>Generate Grad-CAM</span>
            </div>

            <div class="step">
                ⑤
                <strong>Review</strong>
                <span>Inspect result</span>
            </div>

        </div>


        <button class="primary green"
                onclick="go('screening')">

            Start New Screening →

        </button>

    </div>

</section>


<!-- ================= SCREENING ================= -->

<section id="screening"
         class="page">

    <div class="top">

        <div>

            <div class="eyebrow">
                Screening Workspace
            </div>

            <h1>
                New Retinal Screening
            </h1>

            <div class="sub">
                Upload a clear fundus image for analysis.
            </div>

        </div>

    </div>


    <div class="card section">

        <!-- IMPORTANT:
             The file input is now directly inside
             the form that submits to /predict.
        -->

        <form id="predictForm"
              action="/predict"
              method="post"
              enctype="multipart/form-data">


            <div class="upload-grid">


                <div>

                    <div class="drop"
                         id="drop">

                        <div class="eye">
                            👁
                        </div>

                        <h3>
                            Upload Fundus Image
                        </h3>

                        <p>
                            Supported formats: JPG, JPEG, PNG.
                            The image will be processed by your
                            local FastAPI + fine-tuned MobileNetV2 model.
                        </p>


                        <label class="choose"
                               for="file">

                            📤 Choose Image

                        </label>


                        <!-- SINGLE REAL FILE INPUT -->

                        <input id="file"
                               name="file"
                               type="file"
                               accept=".jpg,.jpeg,.png"
                               hidden
                               required>


                        <div id="fname"
                             class="file-name">

                            No image selected

                        </div>

                    </div>


                    <button class="primary green"
                            type="submit">

                        ⚡ Analyze Retinal Image

                    </button>


                </div>


                <div class="preview">

                    <span class="placeholder"
                          id="ph">

                        Image preview will appear here

                    </span>


                    <img id="previewImg"
                         alt="Fundus preview">

                </div>


            </div>

        </form>

    </div>


    <div class="grid g3">

        <div class="card stat">

            <div class="k">
                Preprocessing
            </div>

            <div class="v">
                224×224
            </div>

            <div class="s">
                Image preparation
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                CNN Output
            </div>

            <div class="v">
                Softmax
            </div>

            <div class="s">
                5 probabilities
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Explanation
            </div>

            <div class="v">
                Grad-CAM
            </div>

            <div class="s">
                Visual explanation
            </div>

        </div>

    </div>

</section>


<!-- ================= AI EXPLANATION ================= -->

<section id="explanation"
         class="page">

    <div class="top">

        <div>

            <div class="eyebrow">
                Explainable AI
            </div>

            <h1>
                AI Explanation
            </h1>

            <div class="sub">
                Understand which image regions influenced the prediction.
            </div>

        </div>

    </div>


    <div class="card section">

        <h2>
            🔥 Grad-CAM AI Explanation
        </h2>

        <div class="desc">

            The heatmap is generated from the model's internal
            convolutional features.

        </div>


        <div class="heatmap"
             id="heatmap">

            <div class="empty-heatmap">

                No analysis loaded yet.

                <br><br>

                Run a screening first.

            </div>

        </div>

    </div>


    <div class="card section">

        <h2>
            Latest Prediction
        </h2>

        <div class="classbox"
             id="lastClass"
             style="font-size:28px;font-weight:800;margin:13px 0;color:#35d8ff;">

            No result yet

        </div>

        <div class="confidence"
             id="lastConf">

            Run a screening first

        </div>

    </div>


    <div class="notice">

        ⚠️ This heatmap explains model behavior.
        It should not be interpreted as a medical diagnosis.

    </div>

</section>


<!-- ================= ANALYTICS ================= -->

<section id="analytics"
         class="page">

    <div class="top">

        <div>

            <div class="eyebrow">
                Model Evaluation
            </div>

            <h1>
                Analytics
            </h1>

            <div class="sub">
                Evaluation of the fine-tuned MobileNetV2 model.
            </div>

        </div>

    </div>


    <div class="grid g4">

        <div class="card stat">

            <div class="k">
                Test Accuracy
            </div>

            <div class="v">
                70.36%
            </div>

            <div class="s">
                550 test images
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Macro Precision
            </div>

            <div class="v">
                59.0%
            </div>

            <div class="s">
                Across 5 classes
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Macro Recall
            </div>

            <div class="v">
                52.0%
            </div>

            <div class="s">
                Across 5 classes
            </div>

        </div>


        <div class="card stat">

            <div class="k">
                Macro F1
            </div>

            <div class="v">
                50.0%
            </div>

            <div class="s">
                Across 5 classes
            </div>

        </div>

    </div>

</section>


<!-- ================= HISTORY ================= -->

<section id="history"
         class="page">

    <div class="top">

        <div>

            <div class="eyebrow">
                Local Session
            </div>

            <h1>
                Screening History
            </h1>

            <div class="sub">
                Recent screenings saved in this browser.
            </div>

        </div>

    </div>


    <div class="card section">

        <div id="historyList">

            <div class="history-empty">

                No screening history yet.

            </div>

        </div>

    </div>

</section>


<!-- ================= ABOUT ================= -->

<section id="about"
         class="page">

    <div class="top">

        <div>

            <div class="eyebrow">
                Research Prototype
            </div>

            <h1>
                About the Model
            </h1>

            <div class="sub">
                Architecture and workflow used in this project.
            </div>

        </div>

    </div>


    <div class="card section">

        <h2>
            Project Architecture
        </h2>

        <div class="desc">

            Fundus Image → Preprocessing → Fine-tuned MobileNetV2
            → Softmax → Grad-CAM

        </div>


        <div class="pipeline">

            <div class="step">
                ①
                <strong>Fundus Image</strong>
                <span>Input</span>
            </div>

            <div class="step">
                ②
                <strong>Preprocessing</strong>
                <span>224×224</span>
            </div>

            <div class="step">
                ③
                <strong>MobileNetV2</strong>
                <span>Feature extraction</span>
            </div>

            <div class="step">
                ④
                <strong>Softmax</strong>
                <span>5 classes</span>
            </div>

            <div class="step">
                ⑤
                <strong>Grad-CAM</strong>
                <span>Explanation</span>
            </div>

        </div>

    </div>


    <div class="notice">

        ⚠️ This is an academic research prototype and
        screening aid. It is not a substitute for examination
        or diagnosis by a qualified eye-care professional.

    </div>

</section>


<div class="footer">

    RetinaAI · Fine-tuned MobileNetV2 · 5-Class Classification · Grad-CAM

</div>

</main>


<script>

/* =========================================================
   PAGE NAVIGATION
========================================================= */

const pages =
    [...document.querySelectorAll(".page")];

const links =
    [...document.querySelectorAll(".nav a")];


function go(id){

    location.hash = id;

}


function showPage(){

    let id =
        location.hash.substring(1) || "dashboard";


    if(!document.getElementById(id)){

        id = "dashboard";

    }


    pages.forEach(function(page){

        page.classList.toggle(
            "active",
            page.id === id
        );

    });


    links.forEach(function(link){

        link.classList.toggle(
            "active",
            link.dataset.page === id
        );

    });


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


window.addEventListener(
    "hashchange",
    showPage
);


showPage();


/* =========================================================
   IMAGE PREVIEW
========================================================= */

const file =
    document.getElementById("file");

const preview =
    document.getElementById("previewImg");

const placeholder =
    document.getElementById("ph");

const fileName =
    document.getElementById("fname");


file.addEventListener(
    "change",
    function(){

        if(!file.files.length){

            fileName.textContent =
                "No image selected";

            return;

        }


        const selected =
            file.files[0];


        fileName.textContent =
            "Selected: " + selected.name;


        preview.src =
            URL.createObjectURL(selected);


        preview.style.display =
            "block";


        placeholder.style.display =
            "none";

    }
);


/* =========================================================
   DRAG AND DROP
========================================================= */

const drop =
    document.getElementById("drop");


drop.addEventListener(
    "dragover",
    function(event){

        event.preventDefault();

        drop.style.borderColor =
            "#35d8ff";

    }
);


drop.addEventListener(
    "dragleave",
    function(){

        drop.style.borderColor =
            "#2c5978";

    }
);


drop.addEventListener(
    "drop",
    function(event){

        event.preventDefault();


        drop.style.borderColor =
            "#2c5978";


        if(
            event.dataTransfer.files.length
        ){

            file.files =
                event.dataTransfer.files;


            file.dispatchEvent(
                new Event("change")
            );

        }

    }
);


/* =========================================================
   FORM VALIDATION
========================================================= */

const predictForm =
    document.getElementById("predictForm");


predictForm.addEventListener(
    "submit",
    function(event){

        if(!file.files.length){

            event.preventDefault();

            alert(
                "Please choose a retinal image first."
            );

            return;

        }


        const selected =
            file.files[0];


        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];


        if(
            !allowedTypes.includes(
                selected.type
            )
        ){

            event.preventDefault();

            alert(
                "Please upload a JPG, JPEG, or PNG image."
            );

        }

    }
);

</script>

</body>

</html>