<?php
declare(strict_types=1);
require __DIR__.'/../driver-test.php';
function expect(bool $condition, string $message): void {if (!$condition) throw new RuntimeException($message);}
function rejected(array $input): void {
    try {p10x_driver_payload($input);} catch (InvalidArgumentException $error) {return;}
    throw new RuntimeException('Invalid submission was accepted.');
}
$answers=[];for($i=1;$i<=25;$i++) $answers[$i]=$i===3?[1]:1;
$request=['lead'=>['name'=>'P10X QA','phone'=>'012-345 6789','carModel'=>'Proton X70','referredBy'=>'Others','referredByOther'=>'Academy team'],'answers'=>$answers,'celebrityId'=>'lee_chong_wei','email'=>''];
$payload=p10x_driver_payload($request);
expect(count($payload)===18,'The original webhook field contract changed.');
expect($payload['ppf_score']===32 && $payload['tint_score']===20,'Server scoring differs from the original test.');
expect($payload['ppf_recommendation']==='Hybrid PPF Package','Incorrect PPF recommendation.');
expect($payload['tint_recommendation']==='Medium Grade Window Tint','Incorrect tint recommendation.');
expect($payload['celebrity_name']==='Lee Chong Wei','Incorrect celebrity profile.');
expect($payload['referred_by']==='Others (Academy team)','Other referrer was lost.');
expect($payload['security_addon']==='Yes' && $payload['max_privacy_tint']==='No','Incorrect add-ons.');
expect($payload['email']==='','Initial completion must not invent an email address.');
$withEmail=$request;$withEmail['email']='qa@example.com';$updated=p10x_driver_payload($withEmail);
expect($updated['email']==='qa@example.com','Email update was lost.');
$sent=false;
expect(p10x_driver_deliver($updated,static function(string $destination,string $body)use(&$sent,$updated):bool{
    expect($destination==='https://hooks.zapier.com/hooks/catch/26822386/ux78hze/','Submission destination changed.');
    expect(json_decode($body,true)===$updated,'Webhook payload changed during transport.');$sent=true;return true;
}),'Acknowledged delivery failed.');
expect($sent,'Mock transport was not called.');
expect(!p10x_driver_deliver($updated,static fn()=>false),'A failed delivery was treated as success.');
$bad=$request;unset($bad['answers'][1]);rejected($bad);
$bad=$request;$bad['answers'][3]=[];rejected($bad);
$bad=$request;$bad['answers'][3]=[1,1];rejected($bad);
$bad=$request;$bad['answers'][1]=[1];rejected($bad);
$bad=$request;$bad['answers'][1]=999;rejected($bad);
$bad=$request;$bad['lead']['phone']='not a number';rejected($bad);
$bad=$request;$bad['lead']['name']=['invalid'];rejected($bad);
$bad=$request;$bad['lead']['referredBy']='Unknown';rejected($bad);
$bad=$request;$bad['celebrityId']='unknown';rejected($bad);
$bad=$request;$bad['email']="qa@example.com\nBcc: other@example.com";rejected($bad);
echo "Driver submissions: validation, scoring, original fields and mocked delivery passed. No live requests sent.\n";
