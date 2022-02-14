const express = require('express')

const app = express()

const port = 5000

const month = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'Mei', 'Jun', 'Jul', 'Agt',
    'Sep', 'Okt', 'Nov', 'Des'
]

const db = require('./connection/db')

let projectList = [
    {
        id: 0,
        projectName: "Dumbways Mobile App - 2021",
        duration: "3 bulan",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat corporis magni suscipit libero exercitationem! Aperiam excepturi natus ad nihil cum! Repellat corporis magni suscipit libero exercitationem! Aperiam excepturi natus ad nihil cum",
        start: "12 Jan 2021",
        end: "11 Mar 2021",
        tech: "",
        img: ""
    }
]

app.set('view engine', 'hbs')
app.use('/public', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))


app.listen(port, function () {
    console.log(`server running on port ${port}`);
})

app.get('/', function (req, res){
    let query = 'SELECT * from tb_project ORDER BY id'


    db.connect(function (err, client, done){
        if(err) throw err

        client.query(query, function (err, result){
            done()

            if (err) throw err
            
            let data = result.rows

            data = data.map((card) => {
                return{
                    ...card,
                    duration: monthDuration(card.end_date, card.start_date),
                    node: checkNode(card.technologies),
                    react: checkReact(card.technologies),
                    type: checkType(card.technologies),
                    next: checkNext(card.technologies)
                }

            })

            console.log(data)

            res.render('index', {       
                card: data
            })
        })
    })


    // fetch data dengan array of object
    let dataBlogs = projectList.map(function (data){
        return{
            ...data,
        }
    } )

    console.log(dataBlogs)
})

app.get('/contact', function(req, res){
    res.render('contact')
})

app.get('/add-project', function(req, res){
    res.render('add-project')
})

app.get('/update-project/:id', function(req, res){
    let id = req.params.id

    let queryGetById = `SELECT * FROM tb_project WHERE id = '${id}'`

    db.connect(function (err, client, done){
        if(err) throw err

        client.query(queryGetById, function (err, result){
            done()

            if (err) throw err
            
            let data = result.rows

            data = data.map((card) => {
                return{
                    ...card,
                    start_date: convertDate(card.start_date),
                    end_date: convertDate(card.end_date),
                    node: checkNode(card.technologies),
                    react: checkReact(card.technologies),
                    type: checkType(card.technologies),
                    next: checkNext(card.technologies)
                }

            })

            res.render('update-project', {
                card: data
            })
        })
    })


    let dataBlogs = projectList.map(function (data){
        return{
            ...data,
        }
    } )

    

    // let title = dataBlogs[index].projectName
    // let duration = dataBlogs[index].duration
    // let desc = dataBlogs[index].desc
    // let start = dataBlogs[index].start
    // let end = dataBlogs[index].end

    // res.render('update-project', {
    //     title: title,   
    //     duration: duration, 
    //     desc: desc, 
    //     start: start,
    //     end: end
    // })

    app.post('/update/', function(req, res){
        let name = req.body.name
        let start = req.body.start
        let end = req.body.end
        let desc = req.body.desc
        let img = req.body.img
        let react = req.body.react
        let node = req.body.node
        let type = req.body.type
        let next = req.body.next
    
        let tech = ""
    
        if(react == "true"){
            tech += 'r'
        }
    
        if(node == "true"){
            tech += 'd'
        }
        
        if(type == "true"){
            tech += 't'
        }
    
        if(next == "true"){
            tech += 'n'
        }
    
        console.log('=====' + tech)
        
        let queryUpdateDetail = `UPDATE public.tb_project SET id='${id}', name='${name}', start_date='${start}', end_date='${end}', description='${desc}', technologies='${tech}', image='${img}' WHERE id='${id}'`
    
        db.connect(function (err){
            if(err) throw err
    
            db.query(queryUpdateDetail, function (err, result){
                if(err) throw err
                res.redirect('/')
            })
        })
    
        
    
    })
})    





app.get('/delete-project/:id', function(req, res){
    let index = req.params.id

    let queryDelete = `DELETE FROM public.tb_project WHERE id = ${index}`

    db.connect(function (err, client, done){
        if(err) throw err

        client.query(queryDelete, function (err, result){
            done()

            if (err) throw err
            
            let data = result.rows

            data = data.map((card) => {
                return{
                    ...card,
                }
                
            })

            res.redirect('/')
        })
    })
    
    // projectList.splice(index, 1)
    // res.redirect('/')
})

app.get('/project-detail/:id', function(req, res){
    let id = req.params.id

    let query = `SELECT * from tb_project WHERE id = ${id} `


    db.connect(function (err, client, done){
        if(err) throw err

        client.query(query, function (err, result){
            done()

            if (err) throw err
            
            let data = result.rows

            data = data.map((card) => {
                return{
                    ...card,
                    duration: monthDuration(card.end_date, card.start_date),
                    node: checkNode(card.technologies),
                    react: checkReact(card.technologies),
                    type: checkType(card.technologies),
                    next: checkNext(card.technologies)
                }

            })[0]

            console.log(data)

            let title = data.name
            let desc = data.description
            let start_date = getFullTime(data.start_date) 
            let end_date = getFullTime(data.end_date)
            let duration = data.duration
            let node = data.node
            let react = data.react
            let type = data.type
            let next = data.next

            res.render('project-detail', {
                title: title,   
                duration: duration, 
                desc: desc, 
                start_date,
                end_date,
                node,
                react,
                type,
                next

            })
        })
    })



    // let dataBlogs = projectList.map(function (data){
    //     return{
    //         ...data,
    //     }
    // } )

    // let title = dataBlogs[index].projectName
    // let duration = dataBlogs[index].duration
    // let desc = dataBlogs[index].desc
    // let start = dataBlogs[index].start
    // let end = dataBlogs[index].end

    // res.render('project-detail', {
    //     title: title,   
    //     duration: duration, 
    //     desc: desc, 
    //     start: getFullTime(start),
    //     end: getFullTime(end)
    // })
})

app.post('/project', function (req, res){
    let projectName = req.body.name
    let start = req.body.start
    let end = req.body.end
    let desc = req.body.desc
    let img = req.body.img
    let react = req.body.react
    let node = req.body.node
    let type = req.body.type
    let next = req.body.next

    let tech = ""

    if(react == "true"){
        tech += 'r'
    }

    if(node == "true"){
        tech += 'd'
    }
    
    if(type == "true"){
        tech += 't'
    }

    if(next == "true"){
        tech += 'n'
    }


    console.log(tech)

    let queryAdd = `INSERT INTO public.tb_project (name, start_date, end_date, description, technologies, image) VALUES ('${projectName}', '${start}', '${end}', '${desc}', '${tech}', '${img}')`


    db.connect(function (err){
        if(err) throw console.log(err)

        db.query(queryAdd, function (err, result){
            if(err) throw err
            console.log(result)
            res.redirect('/')   
        })
    })

    // let card = {
    //     projectName,
    //     duration: monthDuration(end, start),
    //     desc,
    //     start: start,
    //     end: end
    // }

    
    // projectList.push(card)


    
})


function monthDuration(endDate, startDate){
    let month
    let year
    let monthDistance
    let endMonth = endDate.getMonth()
    let startMonth = startDate.getMonth()
    let endYear = endDate.getFullYear()
    let startYear = startDate.getFullYear()

    if(startYear == endYear){
        if(startMonth == endMonth){
            month = 1
            return 'durasi ' + month + ' bulan'
        }else{
            month = endMonth - startMonth
            return 'durasi ' + month + ' bulan'
        }
    } 
  
    
    if(endYear > startYear){
        if(endYear - startYear == 1){
            if(startMonth == endMonth){
                return 'durasi 1 tahun'
            }else if(startMonth > endMonth){
                month = (startMonth - endMonth - 12) * -1
                return 'durasi ' + month + ' bulan'
            }else if(startMonth < endMonth){
                month = endMonth - startMonth
                return 'durasi 1 tahun ' + month + ' bulan'
            }
        }else{
            year = endYear - startYear
            if(startMonth == endMonth){
                return 'durasi ' + year + ' tahun '
            }else if(startMonth > endMonth){
                year -= 1
                month = (startMonth - endMonth - 12) * -1
                return 'durasi ' + year + ' tahun ' + month + ' bulan'
            }else if(startMonth < endMonth){
                month = endMonth - startMonth
                return 'durasi ' + year + ' tahun ' + month + ' bulan'
            }
        }
    }

}

function getFullTime(time){
    time = new Date(time)
    const date = time.getDate()
    const monthIndex = time.getMonth()
    const year = time.getFullYear()
  
    return `${date} ${month[monthIndex]} ${year}`
  
  }

function convertDate(time){
    time = new Date(time)
    const date = time.getMonth() + 1
    
    if(date < 10){
        return `${time.getFullYear()}-0${date}-${time.getDate()}`
    } else {
        return `${time.getFullYear()}-${date}-${time.getDate()}`
    }
    

}


function checkNode(tech){
    if(tech.includes('d')){
        return true
    }else{
        return false
    }
}


function checkNext(tech){
    if(tech.includes('n')){
        return true
    }else{
        return false
    }
}

function checkType(tech){
    if(tech.includes('t')){
        return true
    }else{
        return false
    }
}

function checkReact(tech){
    if(tech.includes('r')){
        return true
    }else{
        return false
    }
}
