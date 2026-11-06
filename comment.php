<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function reply(int $code, bool $ok, string $message): never {http_response_code($code);echo json_encode(compact('ok','message'));exit;}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405,false,'Method not allowed.');
$origin=parse_url($_SERVER['HTTP_ORIGIN']??'',PHP_URL_HOST);$host=explode(':',$_SERVER['HTTP_HOST']??'')[0];
if($origin&&strcasecmp($origin,$host)!==0)reply(403,false,'Please submit from the P10X website.');
$name=trim((string)($_POST['author']??''));$email=trim((string)($_POST['email']??''));$comment=trim((string)($_POST['comment']??''));$page=trim((string)($_POST['page']??''));
if(!$name||strlen($name)>200||!filter_var($email,FILTER_VALIDATE_EMAIL)||preg_match('/[\r\n]/',$email)||!$comment||strlen($comment)>8000||!preg_match('~^/[a-z0-9-]+/$~',$page))reply(422,false,'Please enter your name, a valid email address and comment.');
$rate=@fopen(sys_get_temp_dir().'/p10x-comment-'.hash('sha256',$_SERVER['REMOTE_ADDR']??'unknown'),'c+');
if(!$rate||!flock($rate,LOCK_EX))reply(503,false,'Please email info@p10x.my.');
$last=(int)stream_get_contents($rate);if(time()-$last<60){fclose($rate);reply(429,false,'Please wait a minute before sending another comment.');}
$to=getenv('P10X_CONTACT_TO')?:'info@p10x.my';if(!filter_var($to,FILTER_VALIDATE_EMAIL)){fclose($rate);reply(503,false,'Please email info@p10x.my.');}
$sent=mail($to,'P10X article comment for review',"Page: $page\nName: $name\nEmail: $email\n\n$comment",['Reply-To'=>$email,'Content-Type'=>'text/plain; charset=UTF-8']);
if($sent){rewind($rate);ftruncate($rate,0);fwrite($rate,(string)time());}fclose($rate);
if(!$sent)reply(503,false,'Unable to send. Please email info@p10x.my.');
reply(200,true,'Your comment has been sent for review.');
