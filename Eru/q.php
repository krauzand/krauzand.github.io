<?php
$file = fopen('q.csv', 'r');
$rows = [];
$i = 0;
while (($csvRow = fgetcsv($file, null, ';')) !== false) {
	if ($csvRow[0] === null) {
		continue;
	}

	if (count($csvRow) < 3) {
		throw new RuntimeException('Invalid row '. json_encode($csvRow, JSON_THROW_ON_ERROR));
	}

	$rows[] = [
		'id' => ++$i,
		'question' => trim($csvRow[0]),
		'answer' => trim($csvRow[1]),
		'difficulty' => trim($csvRow[2]),
		'fun_fact' => ($csvRow[3] ?? null) === null ? null : trim($csvRow[3]),
	] ;
}
fclose($file);
file_put_contents('q.json', json_encode($rows, JSON_THROW_ON_ERROR+JSON_PRETTY_PRINT));
exit();
