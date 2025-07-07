

const Page = () => {

 
  return (  
    <div className="font-bold">
      Hello World !
    </div>
  );
}
 
export default Page;

//csr sends just html with div id = root and Js renders it in browser
//ssr sends html with data in it, so no need to render it in browser
//difficult to know by naked eye if it is ssr or csr, but you can check the source code of the page
//if you see data in the source code, then it is ssr, if you see just html with div id = root, then it is csr
