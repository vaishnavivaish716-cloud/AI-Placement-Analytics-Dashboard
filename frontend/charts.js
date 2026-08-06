// =======================================
// AI Placement Analytics Dashboard
// charts.js
// =======================================


// ================================
// Company Wise Hiring Chart
// ================================

function loadCompanyChart(){

    fetch("http://127.0.0.1:5000/companies")

    .then(response => response.json())

    .then(data => {


        let companyNames = [];

        let studentsCount = [];



        data.forEach(company => {


            companyNames.push(
                company.company
            );


            studentsCount.push(
                company.studentsPlaced
            );


        });



        const canvas =
        document.getElementById(
            "companyChart"
        );



        if(!canvas) return;



        new Chart(canvas, {


            type:"bar",


            data:{


                labels: companyNames,


                datasets:[{

                    label:
                    "Students Placed",


                    data:
                    studentsCount


                }]


            },


            options:{


                responsive:true,


                scales:{


                    y:{


                        beginAtZero:true


                    }


                }


            }



        });



    })


    .catch(error=>{

        console.log(
            "Company Chart Error:",
            error
        );

    });



}




// ================================
// Department Placement Rate Chart
// ================================


function loadDepartmentChart(){


    fetch(
        "http://127.0.0.1:5000/api/students"
    )


    .then(response=>response.json())


    .then(data=>{


        let departments = {};



        data.forEach(student=>{


            let dept =
            student.department;



            if(!departments[dept]){


                departments[dept]={

                    total:0,

                    placed:0

                };


            }



            departments[dept].total++;



            if(student.status==="Placed"){


                departments[dept].placed++;


            }



        });




        let labels=[];

        let rates=[];




        for(let dept in departments){


            labels.push(dept);



            let rate =
            (
                departments[dept].placed /
                departments[dept].total
            ) * 100;



            rates.push(
                Math.round(rate)
            );



        }




        const canvas =
        document.getElementById(
            "departmentChart"
        );



        if(!canvas) return;




        new Chart(canvas,{


            type:"bar",


            data:{


                labels:labels,


                datasets:[{

                    label:
                    "Placement Rate %",


                    data:rates


                }]


            },


            options:{


                responsive:true,


                scales:{


                    y:{


                        beginAtZero:true,


                        max:100


                    }


                }


            }



        });



    })


    .catch(error=>{


        console.log(
            "Department Chart Error:",
            error
        );


    });



}
function loadPlacementChart(){

    fetch("http://127.0.0.1:5000/api/students")

    .then(response => response.json())

    .then(data => {

        let placed = 0;
        let notPlaced = 0;


        data.forEach(student => {


            if(student.status === "Placed"){

                placed++;

            }
            else{

                notPlaced++;

            }


        });



        const ctx =
        document.getElementById(
            "placementChart"
        );


        if(!ctx) return;



        new Chart(ctx, {

            type:"pie",

            data:{


                labels:[
                    "Placed",
                    "Not Placed"
                ],


                datasets:[{

                    label:"Students",

                    data:[
                        placed,
                        notPlaced
                    ]

                }]

            },


            options:{

                responsive:true

            }

        });



    })

    .catch(error => console.log(error));


}