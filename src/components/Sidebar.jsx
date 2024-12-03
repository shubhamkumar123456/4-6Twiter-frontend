import React,{useState} from 'react'
import { Button, Modal } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'
const Sidebar = (props) => {
  const [loading, setloading] = useState(false);

    let userStore = useSelector((state) => state.user)
    console.log(userStore)

    //**********Modal Opening Code Starts here */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
      //*********Form Details part starts here*******************
      const [formDetails, setFormDetails] = useState({
        title: '',
        description: '',
        file: []
      });
    
      console.log(formDetails)
      const handleInputChanger = (e) => {
        // console.log(e.target.name) // title
        // console.log(e.target.value) // a
        setFormDetails({...formDetails ,[e.target.name]:e.target.value})
      }
      const handleFileChanger = (e) => {
          let files = e.target.files;
          let filesArr = [...files]
          // console.log(filesArr)
    
    
          setFormDetails({...formDetails,file:filesArr})
    
      }
      //using FileReader
      // const handleSubmit = async (e) => {
      //   e.preventDefault()
    
      //   function covertInString(fileObj){
      //       return new Promise((resolve, reject) => {
      //           let reader = new FileReader();
      //           reader.readAsDataURL(fileObj);
      //           reader.onload = ()=>{
      //             resolve(reader.result)
      //           }
      //           reader.onerror=()=>{
      //             reject(reader.error)
      //           }
      //       })
      //   }
    
      //   let arr = formDetails.file.map((fileObj)=>{     // [promise , promise]
      //     let x = covertInString(fileObj)
      //     return x
      //   })
    
      //   let StringArr = await Promise.all(arr).then((ans)=>ans)
      //   // console.log(StringArr) // [string, string]
        
      //   let finalArr = StringArr.map((string)=>{
      //       let obj = {};
      //   if(string.split('/')[0].split(':')[1]==='image'){
      //       obj.resource_type="image",
      //       obj.url = string
          
      //   }
      //   else{
      //     obj.resource_type="video",
      //     obj.url = string
      //   }
    
      //   return obj
      //   })
    
      //   // console.log(finalArr)
    
      //   let finalObj = {
      //     title:formDetails.title,
      //     description:formDetails.description,
      //     file:finalArr
      //   }
    
      //   console.log(finalObj)
    
      //   let res = await axios.post('http://localhost:8080/posts/create',finalObj,{
      //     headers:{
      //       'Authorization':userStore.token
      //     }
      //   });
      //   let data = res.data;
      //   console.log(data)
      //   if(data.success===true){
      //     setFormDetails({
      //       title:'',
      //       description:'',
      //       file:[]
      //     })
      //     setIsModalOpen(false);
      //     props.getAllUserPost()

      //   }
        
    
      // }

      // using cloduinary
      const handleSubmit = async (e) => {
        e.preventDefault()
    
        setloading(true)
       
    
        let arr = formDetails.file.map((fileObj)=>{     // [promise , promise]
          // let x = covertInString(fileObj)
          // return x
          let formData = new FormData();
          formData.append('file',fileObj)
          formData.append('upload_preset','BlogApp') // BlobApp -->upload preset name
             let res1 =  axios.post(`https://api.cloudinary.com/v1_1/dsf7eyovf/upload`,formData) //dsf7eyovf is your cloud name
      
          return res1
        })
    
        let StringArr = await Promise.all(arr).then((ans)=>ans)
        console.log(StringArr)

        let finalArr = StringArr.map((item)=>{
          let obj = {};
          obj.url = item.data.secure_url;
          obj.resource_type = item.data.resource_type
          return obj
        })

        console.log(finalArr)
      
    
        let finalObj = {
          title:formDetails.title,
          description:formDetails.description,
          file:finalArr
        }
    
        let res = await axios.post('https://twitter-ds6j.onrender.com/posts/create',finalObj,{
          headers:{
            'Authorization':userStore.token
          }
        });
        let data = res.data;
        console.log(data)
        if(data.success===true){
          setFormDetails({
            title:'',
            description:'',
            file:[]
          })
          setIsModalOpen(false);
          props.getAllUserPost()

          setloading(false)


        }
        
    
      }
  return (
    <div className='fixed left-0 top-[80px]'>
      <div>
          {/* <button className='bg-green-400 px-3 py-2 rounded-md '>Create</button> */}
          <Button type="primary" onClick={showModal}>
            Create
          </Button>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          { loading===true?"loading...":  <form action="" className='flex flex-col'>
              <label className='mb-2' htmlFor="">Title</label>
              <input value={formDetails.title} name='title' onChange={handleInputChanger} className='outline-none border text-white my-2 border-gray-400 py-2 px-4 rounded-md' type="text" />
              <label  className='mb-2' htmlFor="">Description</label>
              <textarea value={formDetails.description} name='description' onChange={handleInputChanger} className='outline-none border text-white my-2 border-gray-400 py-2 px-4 rounded-md' id=""></textarea>
              <label className='mb-2 py-2 px-4 bg-amber-800 w-max text-white rounded-md hover:bg-amber-700' htmlFor="file">Image/Video</label>
              <input multiple onChange={handleFileChanger} id='file' hidden className='outline-none border my-2 border-gray-400 py-2 px-4 text-white rounded-md' type="file" />
              <div className='flex gap-5 justify-center '>
                {
                  formDetails.file.map((ele,i)=>{
                    return ele.type.split('/')[0] ==='image'? <img key={i} className='h-32 w-32' src={URL.createObjectURL(ele)} alt="" /> :<video key={i} className='h-32 w-32' controls src={URL.createObjectURL(ele)}></video>
                  })
                }
              </div>
              <button onClick={handleSubmit} className='py-2 px-4 bg-sky-950 text-white rounded-md hover:bg-sky-700'>Submit Post</button>
            </form>}
          </Modal>
        </div>
    </div>
  )
}

export default Sidebar
