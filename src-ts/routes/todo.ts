import express from 'express';
import LibLoad from "../../LibLoad"
import { renderTodoList, renderDialog } from "./TodoHx"

const router = express.Router();

router.post('/create', async function(req, res) {
  const retObj = {ret: 500, data: null};
  try {
    const lib = LibLoad.getLib();
    const todoAdd = lib.func('char* todo_add(const char* input)'); 
    const todo_list = lib.func('char* todo_list()');   
    const body = req.body
    console.log(body);
    todoAdd(body.title);
    const resp = todo_list();
    if(resp){
      const out = JSON.parse(resp)
      //console.log(out)
      const ht_str = renderTodoList(out)
      return res.send(ht_str);
    }
    return res.send("")
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/list', async function(req, res) {
  const retObj = {ret: 500, data: null};
  try {
    const lib = LibLoad.getLib();
    const todo_list = lib.func('char* todo_list()');    
    const body = req.body
    const resp = todo_list();
    if(resp){
      const out = JSON.parse(resp)
      console.log(out)
      const ht_str = renderTodoList(out)
      //console.log(ht_str)
      return res.send(ht_str);
    }
    return res.send(resp);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get('/get/:id', async function(req, res) {
  const retObj = {ret: 500, data: null};
  try {
    const lib = LibLoad.getLib();
    const todo_list = lib.func('char* todo_list()');    
    const id = req.params.id;
    console.log("id=", id)
    const resp = todo_list();
    if(resp){
      const out = JSON.parse(resp)
      console.log(out)
      const todo = out.filter(row => row.id === Number(id));
      //console.log(todo)
      if(todo[0]){
        const ht_str = renderDialog(todo[0])
        return res.send(ht_str);
      }
      return res.send("");
    }
    return res.send("");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post('/delete', async function(req, res) {
  const retObj = {ret: 500, data: null};
  try {
    const lib = LibLoad.getLib();
    const todo_list = lib.func('char* todo_list()');   
    const todo_delete = lib.func(
        "todo_delete",
        "int",
        ["int"]
    );   
    const body = req.body
    console.log(body);
    todo_delete(Number(body.id));
    const resp = todo_list();
    if(resp){
      const out = JSON.parse(resp)
      //console.log(out)
      const ht_str = renderTodoList(out)
      return res.send(ht_str);
    }
    return res.send("")    
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
