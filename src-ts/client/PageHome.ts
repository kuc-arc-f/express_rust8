export async function PageHomeLoad (){
  try{
    const data = {}
    const response = await fetch('/api/todo/list', {
      method: 'GET', // リクエストメソッドを指定
      headers: {
        'Content-Type': 'application/json' // JSONを送ることを伝える
      },
      body: JSON.stringify(data) // データをJSON文字列に変換
    });
    // レスポンスのステータスコードを確認
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }
    // 返ってきたJSONデータを解析
    const result = await response.json();
    console.log('成功:', result);      

  }catch(e){console.log(e)}
};

export async function PageHomeTest1 (){
  try{
    console.log("PageHomeTest1")
  }catch(e){console.log(e)}
};